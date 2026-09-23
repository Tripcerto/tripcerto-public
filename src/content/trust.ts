/* Trust page strings, keyed by the reference in "Website copy for review"
   (21 Sep 2026); every string on that page was ours and none was signed
   off. Strings marked `changed` depart from it on Charlie's Positioning and
   Messaging Guide §13 (22 Sep 2026): the page says what Tripcerto does that
   makes AI on a customer's data dependable, rather than promising not to
   take anything. Every fact comes from the compliance set both directors
   approved on 21 Sep 2026 (the monorepo's apps/internal/documents); no
   certificate is claimed. The one string that is a promise rather than a
   fact is marked `owned`. Strings marked `corrected` were rewritten on
   23 Sep 2026 where the monorepo's code contradicted them; where the code
   and the compliance set disagree, this page states what the code does.
   Reply with the reference and the change. */

export const trust = {
  hero: {
    // Three lines, as Taylor set them (22 Sep).
    'T-1-A': ['Your data,', 'Your expertise,', 'You’re in control.'], // changed
    'T-1-B':
      'Tripcerto sits between your content, your systems and the model, so your business can put its own data to work with AI. It decides what the model may read, recommend and do, records what the model read and did, keeps each business’s data apart and leaves the commercial decisions with your experts.', // changed
    'T-1-C': 'Book a demo', // added
    'T-1-D': 'How information moves', // added
  },
  moves: {
    'T-2-A': 'How information moves through the system', // changed
    'T-2-B':
      'Tripcerto reads your content, your product data and your customer records to run the workflow you configured. The main paths, and how long each record is kept, are set out below; the full list of suppliers is available on request. None of it is used to train a model, by us or by our suppliers.', // corrected
    rows: [
      {
        name: 'Your content and product data',
        note: 'Drawn on, never trained on', // corrected
        line: 'The documents and product records you provide are indexed so a conversation can draw on them. Each product or place a visitor is shown as a recommendation comes from matching against the catalogue set for your account.', // corrected
      },
      {
        name: 'The conversation',
        note: 'Written by Anthropic’s model, which keeps nothing', // corrected
        line: 'Anthropic runs the model that writes each reply, under terms that rule out training, and keeps nothing once the reply is written. It receives the conversation and any document uploaded to it. We attach no contact details, but whatever a customer types or uploads goes with it, and in Workspace so do the travellers’ names. A second model, from OpenAI, turns short phrases into the vectors used for matching. It never sees a whole message, and it does not train on what it receives but does keep it.', // corrected
      },
      {
        name: 'Your customer records',
        note: 'Held in London, for a set time', // corrected
        line: 'When a visitor asks to be contacted, their name, contact details and the conversation become an enquiry. It is stored in a database in London, emailed to your team through a mail service in the United States, and deleted after 24 months, or sooner on request. Deleting it removes it from the database at once and from the daily backups within seven days, and we ask your team to delete the copy in its inbox. A conversation that never becomes an enquiry is deleted after 90 days without activity, unless the visitor uploaded a file or saved a plan. Trips and conversations in Workspace are kept until you ask for them to be deleted.', // corrected
      },
      {
        name: 'Your systems',
        note: 'Authoritative, and left where they are',
        line: 'Your CRM, reservations, pricing and availability stay the record, and Tripcerto does not replace them. It writes to none of them unless you approve a connection that lets it.', // corrected
      },
    ], // added
  },
  decides: {
    'T-3-A': 'Matching chooses, the model writes, your expert decides', // corrected
    'T-3-B':
      'The products and places Engage recommends are chosen by matching against the catalogue set for your account, and each one shown is recorded. Workspace builds and prices the trip, and your expert checks it and decides what goes to the customer.', // corrected
    columns: [
      {
        name: 'Matching chooses', // corrected
        line: 'Each product or place a visitor is shown as a recommendation comes from matching against the catalogue set for your account, not from the model’s own knowledge.', // corrected
      },
      {
        name: 'The model writes',
        line: 'The model turns what matching found into a reply, in your voice, and is told never to claim to be human; the chat window tells every visitor that it is an AI assistant. It is instructed not to suggest products or places from its own knowledge. What it may do is a fixed list of actions, set for your account, and each action it takes is recorded.', // corrected
      },
      {
        name: 'Your expert decides',
        line: 'In Workspace, changes to a trip are logged with the person or the process that made them. Nothing reaches the customer until your expert has checked the prices, the exceptions and the recommendation.', // corrected
      },
    ], // added
  },
  access: {
    'T-7-A': 'Each business kept apart, every request checked', // corrected
    'T-7-B': 'Each business we work with is a tenant of its own. Every request is checked against its tenant before any data is read, and changes are logged with who made them.', // corrected
    rows: [
      {
        name: 'Separation',
        note: 'A check on every request',
        line: 'Every request is checked in the application against the tenant it belongs to, at every endpoint, before any data is read. Your consultants see your trips and no other business’s.', // corrected
      },
      {
        name: 'Access',
        note: 'Denied by default, granted against a need',
        line: 'Access to each of our systems is granted per person against a stated need, recorded the same day and removed within one working day of the need ending, with a second factor on every system that offers one. Access is reviewed every quarter, most recently in September 2026.', // corrected
      },
      {
        name: 'Machine access',
        note: 'A credential names your business, never a person',
        line: 'Your own system calls the API with a credential that names your business. Each of your customers is identified by your own reference, and the credential reaches your data and nothing else.',
      },
      {
        name: 'What is recorded',
        note: 'Events, changes, sign-ins and deployments',
        line: 'Application events are logged at the boundary with what happened, how long it took and the outcome, and sent on to a monitoring service that alerts both directors. Replies are recorded with what the model read and the actions it took, and those records are kept for 30 days. Sign-ins are recorded, changes to a trip are logged with who made them, and every deployment is tied to a commit, an author and a time.', // corrected
      },
      {
        name: 'How the system changes',
        note: 'A pull request, checked by the pipeline', // corrected
        line: 'Every code and schema change goes to production as a pull request that runs type checking, linting, tests and an architecture check, and the pipeline applies each schema change from a committed file. Secrets and service settings are set by hand, by the two directors.', // corrected
      },
    ],
  },
  programme: {
    'T-4-A': 'An information security management system aligned to ISO/IEC 27001',
    'T-4-B':
      'The management system is written, approved and operating, and certification is what it is run towards. Tripcerto holds no certificate today and claims none.', // changed: the PDF asked for the programme and the direction of travel
    rows: [
      {
        name: 'Written and approved',
        note: 'September 2026',
        line: 'Scope, policy, risk method, a Statement of Applicability across all 93 controls of ISO/IEC 27001:2022, and the procedures the standard asks for, approved by both directors.',
      },
      {
        name: 'Operating on a schedule',
        note: 'Quarterly, whether or not anything has happened',
        line: 'Risk, access and supplier registers are reviewed every quarter. Incidents are logged, objectives are measured, and the first management review was held and minuted by both directors in September 2026.', // corrected
      },
      {
        name: 'Suppliers, chosen against four tests',
        note: 'A register of everything that receives personal data',
        line: 'Every supplier that receives personal data is recorded with what it receives, where it processes it where that is known, and what assurance it publishes. A supplier is chosen for receiving no more than the job needs, publishing where it processes, offering a second factor and publishing an independent report; a shortfall is recorded as a risk, not waived.',
      },
      {
        name: 'Availability',
        note: 'Checked from outside, backed up daily',
        line: 'External checks run around the clock from outside our own infrastructure, and their history is published on the status page. The database is backed up daily, and a restore was performed and verified in September 2026.', // corrected
      },
      {
        name: 'On the register',
        note: 'Information Commissioner’s Office, ZC233726',
        line: 'Tripcerto Ltd is registered with the Information Commissioner’s Office, the UK regulator for data protection.',
      },
      {
        name: 'The route',
        note: 'Cyber Essentials, then assessment',
        line: 'Cyber Essentials first, then an independent internal audit, then the two-stage ISO/IEC 27001 assessment. Until a certificate is issued, this page will say that none is held.',
      },
    ], // added
  },
  legal: {
    'T-5-A': 'Processing terms, suppliers and your rights', // changed
    'T-5-B': 'What is published, what is provided on request, and how a request about a person’s data is handled.', // changed
    rows: [
      {
        name: 'Privacy notice',
        note: 'Published',
        line: 'What is collected, why, and the rights that go with it.', // corrected
        href: '/legal/privacy',
      },
      {
        name: 'Terms',
        note: 'Published',
        line: 'The terms on which the service is provided.',
        href: '/legal/terms',
      },
      {
        name: 'Processing terms and suppliers',
        note: 'On request',
        line: 'Data processing terms, and the list of suppliers that process personal data with what each receives and where, are available on request.', // owned: Taylor decides that the register and processing terms are provided on request
      },
      {
        name: 'Your rights',
        note: 'Access, a copy, erasure',
        line: 'A request for access, a copy or erasure is answered within the statutory month, and an erasure removes the record and the uploaded files with it.',
      },
    ], // added
  },
  status: {
    'T-6-A': 'Live status', // changed: the address is the link, not the headline
    'T-6-B': 'The checks on the status page run from your own browser when it loads. The history beneath them is recorded by our monitoring service.', // corrected
    'T-6-C': 'status.tripcerto.com', // added
  },
  close: {
    'T-8-A': 'A pilot begins with your security questions answered', // added
    'T-8-B': 'Your security questionnaire is welcome before anything is built.', // added
    'T-8-C': 'Book a demo', // added
    'T-8-D': 'What a pilot delivers', // added
  },
} as const
