/* The information pack form, new on 24 Sep 2026 (the afternoon review:
   Charlie, agreed by both founders): the pilot's pack at the top and foot of
   the Pilot page, and each product's pack in its page's close. The request
   goes to the team by email and the team replies with the pack, so what the
   reader is told after sending promises a reply, not an automatic one.
   Reply with the change. */

export const pack = {
  label: 'Work email', // new
  placeholder: 'Enter your email to get the pack', // new (Taylor, 24 Sep: the field says what it is for, so the button can be short)
  submit: 'Send', // new (Taylor, 24 Sep)
  sending: 'Sending', // new
  sent: 'Thank you. We will email you the pack shortly.', // new
  failed: 'That did not send. Email us and we will send the pack.', // new
  note: 'We use your email to send the pack and to follow up about it.', // new
  privacy: 'Privacy notice', // new
  /* Each pack's name, as the email to the team names it. */
  names: { pilot: 'pilot', engage: 'Engage', workspace: 'Workspace' },
} as const
