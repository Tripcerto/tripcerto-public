/* Trust page strings, keyed by the reference in "Website copy for review"
   (21 Sep 2026); every string on that page was ours and none was signed
   off. Strings marked `changed` depart from it on Charlie's Positioning and
   Messaging Guide §13 (22 Sep 2026): the page says what Tripcerto does that
   makes AI on a customer's data dependable, rather than promising not to
   take anything. Every fact comes from the compliance set both directors
   approved on 21 Sep 2026 (the monorepo's apps/internal/documents); no
   certificate is claimed. The one string that is a promise rather than a
   fact is marked `owned`. Reply with the reference and the change. */

export const trust = {
  hero: {
    // Three lines, as Taylor set them (22 Sep).
    'T-1-A': ['Your data,', 'Your expertise,', 'You’re in control.'], // changed
    'T-1-B':
      'Tripcerto sits between your content, your systems and the model, so your business can put its own data to work with AI. It decides what the model may read, recommend and do, records what the model read and did, keeps every customer’s data apart and leaves the commercial decisions with your experts.', // changed
    'T-1-C': 'Book a demo', // added
    'T-1-D': 'How information moves', // added
  },
  moves: {
    'T-2-A': 'How information moves through the system', // changed
    'T-2-B':
      'Tripcerto reads your content, your product data and your customer records to run the workflow you configured. Where each goes and what it is used for is set out below, and training a model, ours or a supplier’s, is not among the uses.', // changed
    rows: [
      {
        name: 'Your content and product data',
        note: 'Indexed for retrieval, chosen by the system',
        line: 'Your pages, documents and product records are indexed so a conversation can draw on them. Which products, places and operators a visitor sees is decided by matching against the catalogue you enabled, so nothing outside it can be recommended.',
      },
      {
        name: 'The conversation',
        note: 'Written by a model that keeps nothing',
        line: 'Anthropic runs the model that writes each reply. It receives the conversation with no contact field attached, under terms that rule out training, and since September 2026 it retains nothing once the reply is written. A second model turns phrases from the conversation into the vectors used for matching and never sees a whole message.',
      },
      {
        name: 'Your customer records',
        note: 'Held in London, apart from the conversation',
        line: 'Names, contact details and enquiries are held in a database in London, separately from the conversation, for a stated period, and deleted on request. The conversation itself is processed in the United States and discarded.',
      },
      {
        name: 'Your systems',
        note: 'Authoritative, and left where they are',
        line: 'Your CRM, reservations, pricing and availability stay the record. Tripcerto connects to them and does not replace them, and a change reaches them only through a connection you approved.',
      },
    ], // added
  },
  decides: {
    'T-3-A': 'Every recommendation traces back to a source you approved', // changed
    'T-3-B':
      'Engage recommends only from the catalogue and the content you enabled, and records what it used. Workspace builds the trip and leaves the price, the exception and the final call with your expert.', // changed
    columns: [
      {
        name: 'The system chooses',
        line: 'Which product, place or operator a visitor sees is decided by matching against the catalogue you enabled, not by the model. Something outside it cannot appear.',
      },
      {
        name: 'The model writes',
        line: 'The model turns what the system chose into a reply, in your voice, and says that it is an AI at first contact. What it may do in a conversation is a fixed list of actions, set for your account, and each one it takes is recorded.',
      },
      {
        name: 'Your expert decides',
        line: 'In Workspace every change to a trip names the person or the process that made it. Prices, exceptions and the recommendation that goes to the customer stay with your expert.',
      },
    ], // added
  },
  access: {
    'T-7-A': 'Separated by customer, reached by name', // added
    'T-7-B': 'Each customer of ours is a tenant of its own, and every path to its data is checked, recorded and reviewed.', // added
    rows: [
      {
        name: 'Separation',
        note: 'A check on every request',
        line: 'Every request is checked against the tenant it belongs to, at every endpoint, before any data is read. Your consultants see your trips and no other tenant’s.',
      },
      {
        name: 'Access',
        note: 'Denied by default, granted against a need',
        line: 'Access to every system is granted per person against a stated need, recorded the same day, reviewed quarterly and removed within one working day of the need ending. One named account per person per system, and a second factor on every system that offers one.',
      },
      {
        name: 'Machine access',
        note: 'A credential names your business, never a person',
        line: 'Your own system calls the API with a credential that names your business. Each of your customers is identified by your own reference, and the credential reaches your data and nothing else.',
      },
      {
        name: 'What is recorded',
        note: 'Events, changes, sign-ins and deployments',
        line: 'Every application event is recorded at the boundary with what happened, how long it took and the outcome, and shipped to a monitoring service that alerts both directors. Every sign-in is recorded, every change to a trip names who made it, and every deployment is tied to a commit, an author and a time.',
      },
      {
        name: 'How the system changes',
        note: 'A reviewed commit, never an edit in place',
        line: 'Every change reaches production as a pull request that has passed type checking, linting, tests and an architecture check. Nothing is edited in place, and a schema change is a committed file applied by the pipeline, never by hand.',
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
        line: 'Risk, access and supplier registers reviewed quarterly, incidents logged, objectives measured, and a management review held and minuted by both directors.',
      },
      {
        name: 'Suppliers, chosen against four tests',
        note: 'A register of everything that receives personal data',
        line: 'Every supplier that receives personal data is recorded with what it receives, where it processes it and what assurance it publishes. A supplier is chosen for receiving no more than the job needs, publishing where it processes, offering a second factor and publishing an independent report; a shortfall is recorded as a risk, not waived.',
      },
      {
        name: 'Availability',
        note: 'Checked from outside, backed up daily',
        line: 'Eight external checks every three minutes from outside our own infrastructure, with the history published on the status page. The database is backed up daily, and a restore was performed and verified in September 2026.',
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
        line: 'What is collected, why, for how long, and the rights that go with it.',
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
    'T-6-B': 'Every check on the status page runs from your own browser when it loads. Nothing is pre-recorded.', // changed
    'T-6-C': 'status.tripcerto.com', // added
  },
  close: {
    'T-8-A': 'A pilot begins with your security questions answered', // added
    'T-8-B': 'Your security questionnaire is welcome before anything is built.', // added
    'T-8-C': 'Book a demo', // added
    'T-8-D': 'What a pilot delivers', // added
  },
} as const
