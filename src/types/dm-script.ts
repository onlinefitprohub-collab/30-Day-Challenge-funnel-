export interface DmConversationScript {
  trigger: string;       // what prompted this conversation
  opener: string;        // first message the coach sends
  followUps: string[];   // 2–3 follow-up messages if they engage
  bookingBridge: string; // transition message to book a call
  coachingNotes: string; // delivery tips for this path
}

export interface InstagramDmScript {
  overview: string;
  coldOutreach: DmConversationScript;       // new follower / cold DM
  warmLead: DmConversationScript;           // someone who engaged with content or a story
  commentToDm: DmConversationScript;        // converting a post comment into a DM
  applicationInquiry: DmConversationScript; // someone who asked about the programme
  noResponseFollowUp: string;               // single follow-up if they go quiet
  dmTips: string[];                         // 5–7 practical DM outreach tips
}
