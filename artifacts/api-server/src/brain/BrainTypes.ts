export type BrainIntent =
  | "chat"
  | "vision"
  | "memory"
  | "reasoning"
  | "tool"
  | "automation"
  | "system"
  | "unknown";

export interface BrainMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface BrainRequest {
  messages: BrainMessage[];
  language: string;
  image?: string;
}

export interface BrainDecision {
  intent: BrainIntent;
  primaryIntent?: BrainIntent;
  secondaryIntents?: BrainIntent[];
  priority?: number;
  confidence: number;
  reason: string;
  query?: string;
  action?: AutomationAction;
}





export interface BrainPlanStep {
  id: number;
  description: string;
  completed: boolean;
}

export interface BrainExecution {
  success: boolean;
  action?: AutomationAction;
  message?: string;
}


export interface BrainReflection {
  score: number;
  complete: boolean;
  needsFollowUp: boolean;
  usedMemory: boolean;
  usedVision: boolean;
  usedAutomation: boolean;
  notes: string[];
}

export interface BrainResponse {
  decision: BrainDecision;
  execution?: BrainExecution;
  executions?: BrainExecution[];
  plan?: BrainPlanStep[];
  reflection?: BrainReflection;
  reply?: string;
}


export type AutomationAction =
  | "open_camera"
  | "open_whatsapp"
  | "open_settings"
  | "call_contact"
  | "flashlight_on"
  | "unknown";
