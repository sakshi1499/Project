import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import TestConversation from "@/components/campaigns/test-conversation";
import CampaignInstructions from "@/components/campaigns/campaign-instructions";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import {
  ChevronLeft,
  Mic,
  MicOff,
  Play,
  Send,
  Pencil,
  Check,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import type { Campaign } from "@shared/schema";
import Waveform from "@/components/ui/waveform";

// @ts-ignore
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

import { startConversation } from "@/lib/gemini";

// Check if the Gemini API key is available
const isGeminiConfigured = () => {
  return import.meta.env.VITE_GEMINI_API_KEY !== undefined;
};

export default function CampaignCreate() {
  //const [selectedVoice, setSelectedVoice] = useState("indian-male");
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const chat = useRef<Awaited<ReturnType<typeof startConversation>> | null>(
    null,
  );

  // Extract campaign ID from URL if provided for editing
  const searchParams = new URLSearchParams(window.location.search);
  const campaignId = searchParams.get("id")
    ? parseInt(searchParams.get("id") as string)
    : undefined;
  const [selectedVoice, setSelectedVoice] = useState<string>("indian-male");
  const [isProcessing, setIsProcessing] = useState(false);
  const [campaignTitle, setCampaignTitle] = useState("Construction Campaign");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [campaignInstructions, setCampaignInstructions] = useState(
    "Objective: AI sales representative for Aparna Sarovar luxury apartments. Focus on securing site visits.\n\n" +
      "Guidelines:\n" +
      "• Introduce as Amit from Aparna Sarovar\n" +
      "• Keep responses brief and professional\n" +
      "• Guide towards site visit booking\n" +
      "• Address concerns while maintaining visit focus\n" +
      "• Follow compliance and privacy rules\n\n" +
      "Sample Prompt:\n" +
      '"Hello, am I speaking with [Customer Name]?"',
  );

  // State for conversation
  const [conversationHistory, setConversationHistory] = useState<
    { role: string; content: string }[]
  >([]);
  const [userInput, setUserInput] = useState("");
  const [isCallActive, setIsCallActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Speech recognition
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // Speech synthesis
  const synth = typeof window !== "undefined" ? window.speechSynthesis : null;

  // Load campaign data if editing an existing campaign
  const { data: campaignData, isLoading: isLoadingCampaign } =
    useQuery<Campaign>({
      queryKey: ["/api/campaigns", campaignId],
      queryFn: async () => {
        if (!campaignId) return null;
        const response = await fetch(`/api/campaigns/${campaignId}`);
        if (!response.ok) throw new Error("Failed to load campaign");
        return response.json();
      },
      enabled: !!campaignId,
    });

  // Update state with campaign data when loaded
  useEffect(() => {
    if (campaignData) {
      setCampaignTitle(campaignData.name || "Construction Campaign");
      setCampaignInstructions(campaignData.script || "");
      setSelectedVoice(campaignData.voiceType || "indian-male");
    }
  }, [campaignData]);

  // Auto-send message when user stops speaking
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (transcript && !isSpeaking && !isProcessing) {
      timeoutId = setTimeout(() => {
        if (transcript.trim()) {
          handleSendMessage();
        }
      }, 1500);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [transcript, isSpeaking, isProcessing]);

  const startCall = async () => {
    if (!browserSupportsSpeechRecognition) {
      toast({
        title: "Browser Error",
        description:
          "Your browser doesn't support speech recognition. Please use Chrome.",
        variant: "destructive",
      });
      return;
    }

    if (!isGeminiConfigured()) {
      toast({
        title: "API Key Required",
        description:
          "Gemini API key is required for voice agent functionality.",
        variant: "destructive",
      });
      return;
    }

    setIsCallActive(true);
    setConversationHistory([]);
    resetTranscript();

    // Initial AI message with user's name from campaign title
    const userName = campaignTitle.split(" ")[0];
    const initialMessage = {
      role: "assistant",
      content: `Hello, am I speaking with Shiva?`,
    };
    setConversationHistory([initialMessage]);

    // Speak the initial message with Indian voice
    const utterance = new SpeechSynthesisUtterance(initialMessage.content);
    const voices = window.speechSynthesis.getVoices();
    const indianVoice = voices.find((voice) =>
      voice.name.toLowerCase().includes("hindi"),
    );
    if (indianVoice) {
      utterance.voice = indianVoice;
    }
    window.speechSynthesis.speak(utterance);

    // We'll request microphone access only when needed (when user starts speaking)
    utterance.onend = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });

        // Test the audio stream
        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        source.connect(analyser);

        // Start speech recognition
        SpeechRecognition.startListening({ continuous: true });

        toast({
          title: "Microphone Connected",
          description: "Your microphone is working and ready for the call.",
        });
      } catch (error) {
        console.error("Microphone error:", error);
        toast({
          title: "Microphone Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to access microphone. Please check your settings.",
          variant: "destructive",
        });
      }
    };
  };

  const endCall = () => {
    if (synth) synth.cancel();
    SpeechRecognition.stopListening();
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
    const selectedVoiceObj = voices.find((voice) =>
      voice.name
        .toLowerCase()
        .includes(selectedVoice === "indian-male" ? "hindi" : "en-us"),
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

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      console.error("Speech recognition is not supported");
      return;
    }

    let recognitionTimeout: NodeJS.Timeout;

    if (isCallActive && transcript && !isProcessing) {
      // Only process after a brief pause in speaking
      recognitionTimeout = setTimeout(() => {
        if (transcript.trim()) {
          handleSendMessage(transcript);
          resetTranscript();
        }
      }, 1000);
    }

    return () => {
      if (recognitionTimeout) clearTimeout(recognitionTimeout);
    };
  }, [transcript, isCallActive, isProcessing]);

  // Keep recognition active during the call
  useEffect(() => {
    if (isCallActive && !listening && !isSpeaking) {
      SpeechRecognition.startListening({ continuous: true });
    }
  }, [isCallActive, listening, isSpeaking]);

  useEffect(() => {
    if (isCallActive) {
      SpeechRecognition.startListening({ continuous: true, language: "en-US" });
    }
    return () => {
      if (isCallActive) {
        SpeechRecognition.stopListening();
      }
    };
  }, [isCallActive]);

  const handleSendMessage = async (messageContent?: string) => {
    const content = messageContent || userInput;
    if (!content.trim() || isProcessing) return;

    let timeoutId: NodeJS.Timeout;
    const TIMEOUT_DURATION = 15000; // 15 seconds timeout for better stability

    // Add user message to conversation immediately
    const userMessage = { role: "user", content: content.trim() };
    setConversationHistory((prev) => [...prev, userMessage]);
    setIsProcessing(true);
    resetTranscript();
    setUserInput("");

    try {
      // Set up timeout for the API call
      const timeoutPromise = new Promise((_, reject) => {
        timeoutId = setTimeout(
          () => reject(new Error("Request timeout")),
          TIMEOUT_DURATION,
        );
      });

      if (!chat.current) {
        chat.current = await startConversation();
        await chat.current.sendMessage(campaignInstructions);
      }

      // Race between the API call and timeout
      const stream = await Promise.race([
        chat.current.sendMessage(content.trim()),
        timeoutPromise,
      ]);

      clearTimeout(timeoutId);
      let fullResponse = '';
      
      for await (const chunk of stream) {
        const textChunk = chunk.text();
        fullResponse += textChunk;
        
        // Update conversation in real-time
        setConversationHistory((prev) => {
          const newHistory = [...prev];
          if (newHistory[newHistory.length - 1]?.role === 'assistant') {
            newHistory[newHistory.length - 1].content = fullResponse;
          } else {
            newHistory.push({ role: 'assistant', content: fullResponse });
          }
          return newHistory;
        });
        
        // Speak each chunk as it arrives
        if (textChunk.trim()) {
          speakText(textChunk);
        }
      }

      // Don't start listening until AI has finished speaking
      utterance.onend = () => {
        if (isCallActive) {
          resetTranscript();
          SpeechRecognition.startListening({ continuous: true });
        }
      };
    } catch (error) {
      console.error("AI Response Error:", error);
      toast({
        title: "AI Response Error",
        description:
          error instanceof Error && error.message === "Request timeout"
            ? "Response took too long. Please try again."
            : "Failed to get a response. Please try again.",
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
      <div className="flex items-center justify-between p-2 sm:p-4 border-b">
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
                  if (e.key === "Enter") {
                    setIsEditingTitle(false);
                  }
                }}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditingTitle(false)}
              >
                <Check className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <h1 className="text-xl font-bold">{campaignTitle}</h1>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditingTitle(true)}
              >
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
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0 .73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            Configure & Launch
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2 sm:p-4 h-[calc(100vh-12rem)]">
        {/* Left column - Campaign Instructions */}
        <CampaignInstructions
          selectedVoice={selectedVoice}
          setSelectedVoice={setSelectedVoice}
          campaignInstructions={campaignInstructions}
          setCampaignInstructions={setCampaignInstructions}
        />

        {/* Right column - Test Conversation */}
        <div className="flex flex-col h-full bg-card rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-semibold">Test Conversation</h2>
          </div>

          {!isCallActive ? (
            <TestConversation
              onStartCall={startCall}
              isCallActive={isCallActive}
            />
          ) : (
            <div className="flex flex-col flex-1 w-full">
              {/* Conversation display */}
              <div className="flex-1 p-4 space-y-4">
                {conversationHistory.map((message, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 ${
                      message.role === "assistant" ? "" : "justify-end"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-white text-black flex items-center justify-center">
                        <span className="text-s font-medium">AI</span>
                      </div>
                    )}
                    <div
                      className={`rounded-lg px-4 py-2 max-w-[80%] ${
                        message.role === "assistant"
                          ? "bg-zinc-800 text-white"
                          : "bg-[#8257E6] text-white"
                      }`}
                    >
                      {message.content}
                    </div>
                    {message.role === "user" && (
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-[#8257E6] flex-shrink-0">
                        <img
                          src="https://ui-avatars.com/api/?name=Shiva+Chintaluru&background=random"
                          alt="User"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                ))}

                {/* AI Typing Indicator */}
                {isProcessing && (
                  <div className="mb-4 text-left">
                    <div className="inline-block rounded-lg px-4 py-2 max-w-[80%] bg-muted">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-foreground/50 animate-bounce" />
                        <div className="w-2 h-2 rounded-full bg-foreground/50 animate-bounce [animation-delay:0.2s]" />
                        <div className="w-2 h-2 rounded-full bg-foreground/50 animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  </div>
                )}

                {/* User Speaking Indicator */}
                {listening && !isProcessing && transcript && (
                  <div className="mb-4 text-right">
                    <div className="inline-block rounded-lg px-4 py-2 max-w-[80%] bg-primary text-primary-foreground">
                      {transcript}
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Voice Status Area */}
              <div className="border-t p-4 flex justify-center items-center gap-2">
                {isSpeaking ? (
                  <div className="flex items-center gap-2">
                    <Waveform className="h-4" />
                    <span className="text-sm">AI Speaking...</span>
                  </div>
                ) : listening ? (
                  <div className="flex items-center gap-2">
                    <Mic className="h-4 w-4 text-primary animate-pulse" />
                    <span className="text-sm">Listening...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Mic className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Waiting for AI...</span>
                  </div>
                )}
                <Button
                  variant="destructive"
                  onClick={endCall}
                  className="ml-4"
                >
                  End Call
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 bg-background flex flex-col sm:flex-row gap-2 sm:gap-4 justify-between p-4 border-t">
        <Button
          variant="outline"
          onClick={() => setLocation("/campaigns")}
          className="w-full sm:w-32"
        >
          Cancel
        </Button>
        <Button
          onClick={() =>
            setLocation(
              campaignId
                ? `/campaign-audience?id=${campaignId}`
                : "/campaign-audience",
            )
          }
          className="w-full sm:w-auto"
        >
          Next: {campaignId ? "Update" : "Select"} your audience
        </Button>
      </div>
    </div>
  );
}