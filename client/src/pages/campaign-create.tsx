import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { ChevronLeft, Mic, MicOff, Play, Send, Pencil, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import type { Campaign } from "@shared/schema";
import Waveform from "@/components/ui/waveform";

// @ts-ignore
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

// Check if the OpenAI API key is available
const isOpenAIConfigured = () => {
  return import.meta.env.VITE_OPENAI_API_KEY !== undefined;
};

export default function CampaignCreate() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Extract campaign ID from URL if provided for editing
  const searchParams = new URLSearchParams(window.location.search);
  const campaignId = searchParams.get('id') ? parseInt(searchParams.get('id') as string) : undefined;
  const [selectedVoice, setSelectedVoice] = useState("indian-male");
  const [isProcessing, setIsProcessing] = useState(false);
  const [campaignTitle, setCampaignTitle] = useState("Construction Campaign");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [campaignInstructions, setCampaignInstructions] = useState(
    "Objective: You are an AI sales representative calling on behalf of Aparna Sarovar, a premium luxury apartment project in Nallagandla. Your goal is to engage the customer, gauge their interest, and persuade them to visit the site. The primary focus is on securing a visit rather than providing extensive details over the call.\n\n" +
    "Agent Prompt & Guidelines:\n" +
    "• Greet the customer by name and introduce yourself as Amit, a representative from Aparna Sarovar.\n" +
    "• Maintain a friendly and professional tone.\n" +
    "• Keep responses concise and avoid speaking more than two sentences at a time.\n" +
    "• Always end with a question or prompt to encourage customer response.\n" +
    "• If the customer is interested, guide them toward booking a site visit.\n" +
    "• If they hesitate, address their concerns but steer the conversation back to the visit.\n" +
    "• Adapt responses based on the customer's interest and objections.\n" +
    "• Avoid overloading the customer with information—focus on securing a visit.\n" +
    "• Log key details (interest level, preferred visit time, objections, etc.) into the CRM.\n" +
    "• Ensure data privacy and compliance with DND regulations.\n" +
    "• Follow predefined scripts while allowing for dynamic, context-based interactions.\n\n" +
    "Call Flow & Sample Prompts:\n" +
    "1. Introduction:\n" +
    "   • \"Hello, am I speaking with [Customer Name]?\""
  );
  
  // State for conversation
  const [conversationHistory, setConversationHistory] = useState<{ role: string; content: string }[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isCallActive, setIsCallActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Speech recognition
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();
  
  // Speech synthesis
  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
  
  // Load campaign data if editing an existing campaign
  const { data: campaignData, isLoading: isLoadingCampaign } = useQuery<Campaign>({
    queryKey: ['/api/campaigns', campaignId],
    queryFn: async () => {
      if (!campaignId) return null;
      const response = await fetch(`/api/campaigns/${campaignId}`);
      if (!response.ok) throw new Error('Failed to load campaign');
      return response.json();
    },
    enabled: !!campaignId
  });

  // Update state with campaign data when loaded
  useEffect(() => {
    if (campaignData) {
      setCampaignTitle(campaignData.name || "Construction Campaign");
      setCampaignInstructions(campaignData.script || "");
      setSelectedVoice(campaignData.voiceType || "indian-male");
    }
  }, [campaignData]);
  
  // Auto-update transcript to input field
  useEffect(() => {
    if (transcript) {
      setUserInput(transcript);
    }
  }, [transcript]);
  
  const startCall = async () => {
    if (!isOpenAIConfigured()) {
      toast({
        title: "API Key Required",
        description: "OpenAI API key is required for voice agent functionality.",
        variant: "destructive",
      });
      return;
    }
    
    setIsCallActive(true);
    setConversationHistory([]);
    
    // Initial AI message based on campaign instructions
    const initialMessage = {
      role: "assistant",
      content: "Hello, am I speaking with Shiva?"
    };
    
    setConversationHistory([initialMessage]);
    
    // Speak the initial message
    speakText(initialMessage.content);
  };
  
  const endCall = () => {
    if (synth) synth.cancel();
    if (listening) SpeechRecognition.stopListening();
    setIsCallActive(false);
    resetTranscript();
    setUserInput("");
  };
  
  const speakText = (text: string) => {
    if (!synth) return;
    
    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice based on selection
    const voices = synth.getVoices();
    const selectedVoiceObj = voices.find(voice => 
      voice.name.toLowerCase().includes(selectedVoice === "indian-male" ? "hindi" : "en-us")
    );
    
    if (selectedVoiceObj) {
      utterance.voice = selectedVoiceObj;
    }
    
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    
    synth.speak(utterance);
  };
  
  const toggleMicrophone = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
    }
  };
  
  const handleSendMessage = async () => {
    if (!userInput.trim() || isProcessing) return;
    
    // Add user message to conversation
    const userMessage = { role: "user", content: userInput };
    setConversationHistory(prev => [...prev, userMessage]);
    setIsProcessing(true);
    resetTranscript();
    setUserInput("");
    
    try {
      // Create system message from campaign instructions
      const systemMessage = { role: "system", content: campaignInstructions };
      
      // Prepare messages for API call
      const messages = [
        systemMessage,
        ...conversationHistory,
        userMessage
      ];
      
      // Call OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: messages,
        })
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      const aiResponse = data.choices[0].message.content;
      
      // Add AI response to conversation
      const assistantMessage = { role: "assistant", content: aiResponse };
      setConversationHistory(prev => [...prev, assistantMessage]);
      
      // Speak the AI response
      speakText(aiResponse);
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      toast({
        title: "AI Response Error",
        description: "Failed to get a response from the AI. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom of conversation
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversationHistory]);
  
  return (
    <div className="flex flex-col h-full">
      {/* Header bar */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/campaigns")}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          {isEditingTitle ? (
            <div className="flex items-center gap-1">
              <Input
                className="h-8 w-60"
                value={campaignTitle}
                onChange={(e) => setCampaignTitle(e.target.value)}
                autoFocus
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setIsEditingTitle(false);
                  }
                }}
              />
              <Button variant="ghost" size="icon" onClick={() => setIsEditingTitle(false)}>
                <Check className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <h1 className="text-xl font-bold">{campaignTitle}</h1>
              <Button variant="ghost" size="icon" onClick={() => setIsEditingTitle(true)}>
                <Pencil className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b">
        <div className="flex-1 text-center py-3 border-b-2 border-primary">
          <span className="inline-flex items-center">
            <svg
              className="mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            Craft your Message
          </span>
        </div>
        <div className="flex-1 text-center py-3 text-muted-foreground">
          <span className="inline-flex items-center">
            <svg
              className="mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            Add your audience
          </span>
        </div>
        <div className="flex-1 text-center py-3 text-muted-foreground">
          <span className="inline-flex items-center">
            <svg
              className="mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            Configure & Launch
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col md:flex-row flex-1 overflow-y-auto md:overflow-hidden p-4 gap-4 relative">
        {/* Left panel - Campaign Instructions */}
        <div className="w-full md:w-1/2 relative z-10 mb-6 md:mb-0">
          <h2 className="text-lg font-semibold mb-2">Campaign Instructions</h2>
          
          <div className="mb-4">
            <Select value={selectedVoice} onValueChange={setSelectedVoice}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="indian-male">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="sr-only">Indian Male Voice</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                        <line x1="12" x2="12" y1="19" y2="22" />
                      </svg>
                    </div>
                    Indian Male Voice
                  </div>
                </SelectItem>
                <SelectItem value="us-female">US Female Voice</SelectItem>
                <SelectItem value="uk-male">UK Male Voice</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="mb-2 flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Generated by AI</span>
          </div>
          
          <div className="overflow-hidden rounded-md border border-input h-[400px] md:h-[600px]">
            <Textarea
              className="w-full h-full font-mono text-sm resize-none overflow-auto pr-4 border-none rounded-none"
              value={campaignInstructions}
              onChange={(e) => setCampaignInstructions(e.target.value)}
            />
          </div>
        </div>

        {/* Right panel - Test the Conversation */}
        <div className="w-full md:w-1/2 relative z-10">
          <h2 className="text-lg font-semibold mb-4">Test the Conversation</h2>
          
          {!isCallActive ? (
            <div className="flex flex-col items-center justify-center h-[400px] md:h-[600px] bg-muted/30 rounded-lg">
              <Button
                size="lg"
                className="mb-2"
                onClick={startCall}
              >
                Start Call
              </Button>
              <p className="text-sm text-muted-foreground">
                Click to test your voice agent with the current configuration
              </p>
            </div>
          ) : (
            <Card className="flex flex-col h-[400px] md:h-[600px]">
              {/* Conversation display */}
              <div className="flex-1 p-4 overflow-y-auto">
                {conversationHistory.map((message, index) => (
                  <div
                    key={index}
                    className={`mb-4 ${
                      message.role === "assistant" ? "text-left" : "text-right"
                    }`}
                  >
                    <div
                      className={`inline-block rounded-lg px-4 py-2 max-w-[80%] ${
                        message.role === "assistant"
                          ? "bg-muted"
                          : "bg-primary text-primary-foreground"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              
              {/* Input area */}
              <div className="border-t p-4 flex gap-2">
                <Button
                  size="icon"
                  variant={listening ? "default" : "outline"}
                  onClick={toggleMicrophone}
                  disabled={isSpeaking}
                >
                  {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                <Textarea
                  className="flex-1 min-h-[40px] max-h-[120px]"
                  placeholder="Type your message..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  disabled={isSpeaking}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <div className="flex flex-col gap-2">
                  <Button
                    size="icon"
                    onClick={handleSendMessage}
                    disabled={!userInput.trim() || isProcessing || isSpeaking}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={endCall}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 2v4" />
                      <path d="M8 2v4" />
                      <path d="M3 10h18" />
                      <path d="M19.5 12.5L12 20" />
                      <path d="M19.5 19.5L17 22" />
                      <path d="M12 15l-4.5 7.5" />
                      <path d="M4 13l3 3" />
                    </svg>
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between p-4 border-t">
        <Button
          variant="outline"
          onClick={() => setLocation("/campaigns")}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
        <Button 
          onClick={() => setLocation(campaignId ? 
            `/campaign-audience?id=${campaignId}` : 
            "/campaign-audience")} 
          className="w-full sm:w-auto"
        >
          Next: {campaignId ? "Update" : "Select"} your audience
        </Button>
      </div>
    </div>
  );
}