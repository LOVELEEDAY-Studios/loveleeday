#!/usr/bin/env node
// Builds the legal pages in public/site from the content below, using the head and layout of privacy.html as the template.
//   node scripts/build-legal-pages.mjs   write the pages (pages already stamped by one-brand-chrome keep working: the template is re-read each run)
// After writing, run: node scripts/one-brand-chrome.mjs <pages>  (stamps header and footer) and node scripts/site-postprocess.mjs.
import fs from "node:fs";
import path from "node:path";

const site = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../public/site");

const DATE = "November 8, 2026";
const E = '<!--email_off--><a href="mailto:hello@loveleedaystudios.com">hello@loveleedaystudios.com</a><!--/email_off-->';
const POLICIES = 'our <a href="/privacy">privacy page</a>, <a href="/terms">terms</a>, <a href="/data-processing">data processing addendum</a>, <a href="/data-retention">retention and deletion page</a>, <a href="/ai-and-model-improvement">AI and model improvement policy</a> and <a href="/subprocessors">subprocessor list</a>';

const pages = [
  {
    file: "privacy.html", path: "/privacy", title: "Privacy",
    desc: "What LOVELEEDAY collects through this site, who processes it, how long it is kept, and how to use your rights.",
    h1: "What this site collects, and who handles it.", lede: "How LOVELEEDAY handles your information, and how to use your rights over it.",
    sections: [
      ["Who we are", [
        `This site is run by LOVELEEDAY Studios LLC (&ldquo;LOVELEEDAY&rdquo;, &ldquo;we&rdquo;). We decide what is collected through the forms and pages described below and how it is used, and we are responsible for it.`,
        `You can reach us at ${E}.`,
        `This page covers the information we collect as a business about visitors and people who write to us. When we handle a client&rsquo;s data on the client&rsquo;s behalf, we act as a processor, and the <a href="/data-processing">data processing addendum</a> applies instead.`]],
      ["What we collect", [
        `The contact form asks for your name, your work email, your organization, the subject you are writing about and your question. It also offers an optional box for where the information lives.`,
        `The question form on the home page asks for your work email, your organization and the first question you would ask.`,
        `The project brief on the studio page asks for your name, your email, your organization, the area of work, and three descriptions: the question you need answered, the records or systems involved, and what a useful result would look like. A copy of the brief also downloads to your own device.`,
        `Nothing beyond what you type is requested. We use it only to read your note, reply to you and decide whether and how we can help.`,
        `Like any website, our hosting provider keeps standard server request logs, such as the time of a visit, the page requested and the network address it came from.`]],
      ["Private review pages", [
        `Some work is shared with one organization on an unguessable link, with no login. On those pages, and only those, we record that the page was opened: the page, the time, how long it stayed open, the browser type, the page that linked to it, and a shortened one-way fingerprint of the network address (not the address itself). We use this to know whether the people we prepared the page for have seen it.`,
        `Those pages also have an &ldquo;Ask Arthur&rdquo; box. A question typed there is sent to Arthur, our own hosted service, which answers from the material in that page. If that service is unavailable, the same question goes to a language model provider named on our <a href="/subprocessors">subprocessor list</a>. We keep the question, the first line of the answer, the page it came from and the same one-way fingerprint, so our team can see what was asked.`,
        `Please do not type personal, financial or confidential details into an Ask Arthur box. Those pages carry instructions to search engines not to index, follow, archive or excerpt them, and an unrecognised link returns a not-found page rather than an empty one. Treat the link itself as the credential: anyone holding it can open the page.`]],
      ["Why we use it", [
        `To read and answer your note or brief, to decide whether and how we can help, to keep the site running and secure, to see whether a page we prepared for you was reached, and to meet our legal duties.`,
        `Where the law asks for a legal basis (for example in Europe and the United Kingdom), ours is our legitimate interest in replying to people who write to us and in keeping the site secure, or taking steps you asked for before an agreement, or your consent where we ask for it.`]],
      ["Where it goes", [
        `Each note or brief is emailed to ${E}, and a confirmation is emailed to you. The forms do not write what you type to a database; the record is those two emails.`,
        `Page-open records and Ask Arthur questions from private review pages are stored in a database run for us by a service provider.`,
        `Our service providers handle information only to provide their service to us. They are listed, with what each does, on the <a href="/subprocessors">subprocessor list</a>.`]],
      ["We do not sell your information", [
        `We do not sell your personal information and we do not share it for advertising across other sites. We do not use it to profile you or to make automated decisions about you. We do not use what you send us to train AI models; the <a href="/ai-and-model-improvement">AI and model improvement policy</a> explains the narrow, de-identified use we may make of client data.`]],
      ["How long we keep it", [
        `Notes and briefs stay in our mailbox while we are in conversation with you, and we delete them within 24 months after the last message unless you become a client, in which case the agreement for that work sets what is kept.`,
        `Page-open records and Ask Arthur questions are deleted when you ask, and in any case within 24 months after our last contact with the organization the page was prepared for.`,
        `Server request logs are kept by our hosting provider for a short period set by that provider, and are used only to keep the site running and secure.`,
        `The <a href="/data-retention">retention and deletion page</a> covers client data.`]],
      ["What the public pages do not do", [
        `No cookies for visitors. No localStorage, sessionStorage or IndexedDB.`,
        `No analytics, no tracking pixels and no advertising tags of any kind.`,
        `No tracking or advertising scripts, and no externally hosted fonts.`]],
      ["Your rights", [
        `You can ask us what we hold about you, ask us to correct it, ask us to delete it, ask for a copy in a portable form, or object to how we use it. You can also withdraw consent where we rely on it. Write to ${E}.`,
        `Because the forms store nothing in a database, deleting your note means deleting the emails. Say so in your message, and both the note and the confirmation will be removed from the mailbox. If your question came from a private review page, tell us which page and we will remove that record too.`]],
      ["If you live in California", [
        `The California Consumer Privacy Act, as amended, gives you the right to know what personal information we collect, use and disclose, to delete it, to correct it, to opt out of its sale or sharing, and to limit the use of sensitive information. You will not be treated differently for using these rights.`,
        `In the last twelve months we collected identifiers and contact details (name, email address, organization), the content of messages you sent us, and, from private review pages only, internet activity (page opened, time, browser type, referring page and a one-way fingerprint of the network address). We collected it from you, directly or through the page you used. We disclosed it only to the service providers named on the <a href="/subprocessors">subprocessor list</a>, for the purposes above. We do not sell or share personal information, and we do not collect sensitive personal information through this site.`]],
      ["If you are in Europe or the United Kingdom", [
        `LOVELEEDAY Studios LLC is the controller of the information described on this page. You have the rights to access, correct, delete, restrict and object to processing, to receive your information in a portable form, and to withdraw consent. Our bases are those under &ldquo;Why we use it&rdquo;.`,
        `Our service providers store information in the United States. Where the law requires a transfer mechanism, we rely on the standard contractual clauses approved for that purpose.`,
        `You can also complain to the data protection authority where you live.`]],
      ["How to make a request", [
        `Email ${E} and say what you would like us to do. We may ask you to confirm you control the email address you wrote from, or for one more detail so we do not act on the wrong record. An agent may write for you if they show your written permission.`,
        `We reply within 30 days. If a request is complicated we may take up to 30 more days, and we will tell you why before the first 30 are up. If we decline a request we will say why, and you may ask us to review that decision by replying to our message.`]],
      ["Children", [`The site is for people who work in organizations. It is not for children under 16, and we do not knowingly collect their information.`]],
      ["Changes to this page", [`When we change how the site handles information, we will update this page and the date below.`]],
    ],
  },
  {
    file: "terms.html", path: "/terms", title: "Terms",
    desc: "The terms for using this site and for work LOVELEEDAY does for clients, including who owns your data.",
    h1: "The terms for using this site and our work.", lede: "How to use this site, how client data is treated, and what sending us a note does and does not commit either of us to.",
    sections: [
      ["Using the site", [`The site is information about LOVELEEDAY Studios LLC (&ldquo;LOVELEEDAY&rdquo;) and the way we work. You are welcome to read it, link to it and share it. Please do not try to disrupt it or use it to harm others.`]],
      ["Ownership", [
        `The site and everything on it, including its text, images, design, software and the names LOVELEEDAY and Arthur, belong to LOVELEEDAY Studios LLC or its licensors and are protected by copyright, trademark and other laws. You may not copy, reproduce or reuse them as your own without our written permission, except for quoting short passages with a link back to the page.`,
        `Other company and product names and logos shown on the site belong to their respective owners and are used only to identify the systems we connect to.`]],
      ["Illustrations", [`Examples on this site are for explanation only. They are not customer results and not a promise of a particular outcome.`]],
      ["Sending a note", [
        `Sending a note or project brief starts a conversation. It does not create a contract, an engagement or a duty to reply with a proposal. Any work begins only when both sides sign a written agreement for it.`,
        `Please do not send passwords, payment details or anything you are not allowed to share. How we handle what you do send is described on the <a href="/privacy">privacy page</a>.`]],
      ["Work for clients", [
        `Work for a client is done under a written agreement. These terms apply to that work to the extent the agreement does not say otherwise, and where they differ the agreement controls.`,
        `Your data stays yours. Everything you give us or let us connect to, and the records and answers made from it, belongs to you, and we claim no ownership of it. You are responsible for having the right to share it with us.`,
        `You give us permission to use your data only to provide the service to you, on your instructions, and to keep that service secure. We do not use it for any other client, we do not sell it, and we do not use it to train models, except in the narrow de-identified and aggregated way set out in the <a href="/ai-and-model-improvement">AI and model improvement policy</a>, which you can opt out of.`,
        `Where we process personal information for you, the <a href="/data-processing">data processing addendum</a> applies. What happens to your data when the work ends is on the <a href="/data-retention">retention and deletion page</a>.`]],
      ["Clients and the portal", [`Clients sign in to the client portal under a written agreement, and use of the portal is covered by its own terms and privacy page.`]],
      ["Disclaimer", [
        `We work to keep the site accurate and available, but we provide it &ldquo;as is&rdquo; and &ldquo;as available&rdquo;, without warranties of any kind, whether express or implied, including that it will always be up or free of mistakes. Nothing on the site or in an answer from Arthur is legal, financial, tax or professional advice, and you should check anything you rely on against your own records and advisers.`,
        `Links to other sites are for convenience; we are not responsible for them.`]],
      ["Limit of liability", [
        `To the fullest extent the law allows, LOVELEEDAY Studios LLC is not liable for any indirect, incidental, special or consequential loss, or for any loss of profit, data or business, arising from your use of the site or your reliance on it.`,
        `For work done for a client, our total liability for all claims arising from that work is limited to the fees the client paid us for it in the twelve months before the event that gave rise to the claim, unless the written agreement says otherwise.`,
        `Nothing in these terms limits liability that cannot be limited by law.`]],
      ["Ending the work", [`Either side may end an engagement as its agreement allows. When it ends, we return and delete your data as described on the <a href="/data-retention">retention and deletion page</a>.`]],
      ["Governing law", [`These terms are governed by the laws of the State of Michigan, without regard to its conflict-of-laws rules.`]],
      ["Changes and questions", [`We may update these terms and will change the date below when we do. A change to a client agreement is made only in writing and signed by both sides. Questions to ${E}.`]],
    ],
  },
  {
    file: "dpa.html", path: "/data-processing", title: "Data processing addendum",
    desc: "How LOVELEEDAY handles personal information on a client's behalf: roles, security, subprocessors, breach notice, and return and deletion.",
    h1: "The data processing addendum.", lede: "The terms that apply when LOVELEEDAY handles personal information for a client.",
    sections: [
      ["Purpose and scope", [
        `This addendum applies when LOVELEEDAY Studios LLC (&ldquo;LOVELEEDAY&rdquo;) handles personal information on behalf of a client as part of an engagement. It forms part of the written agreement for that work. If it conflicts with the agreement on how personal information is handled, this addendum controls.`,
        `A signed copy is available on request at ${E}.`]],
      ["Roles", [`The client decides why and how its personal information is used and is the controller (or, under California law, the business). LOVELEEDAY is the processor (or service provider) and handles that information only for the client.`]],
      ["Instructions", [
        `We process personal information only on the client&rsquo;s documented instructions, which are the agreement, this addendum and the client&rsquo;s use of the service. If we think an instruction breaks the law we will say so, and we may pause until it is settled.`]],
      ["What we process", [
        `Subject matter: reading the systems the client connects and answering questions from them. Duration: the length of the engagement plus the deletion period on the <a href="/data-retention">retention and deletion page</a>. Data subjects: the client&rsquo;s staff, customers, suppliers and others whose records sit in the connected systems. Types: whatever those systems hold, which the client scopes when it connects them.`]],
      ["Confidentiality", [`People at LOVELEEDAY who can reach client data are bound to keep it confidential and reach it only when the work needs it.`]],
      ["Security", [`We keep client data separate from every other client&rsquo;s, encrypted, on hosting in the United States, and we limit access to those who need it. What we say about this is on the <a href="/trust">trust and security page</a>; a longer security packet is available on request at ${E}.`]],
      ["Subprocessors", [
        `The client agrees that we may use the subprocessors on the <a href="/subprocessors">subprocessor list</a>, and the ones named for its engagement. Each is bound to handle the information only to provide its service to us, with protections no weaker than these. We will tell the client in writing before adding or replacing a subprocessor that will handle its personal information, and the client may object on reasonable grounds; if we cannot resolve it, the client may end the affected work.`]],
      ["Requests from individuals", [`If someone asks us about information we hold for a client, we pass the request to the client and do not answer it ourselves unless the client tells us to. We help the client respond to access, correction, deletion and similar requests, to the extent the service makes that possible.`]],
      ["Personal data breach", [`If we confirm a breach of security that affects a client&rsquo;s personal information, we will tell the client without undue delay, and within 72 hours of confirming it, with what we know about what happened, what was affected and what we are doing. We will keep the client informed as we learn more and help it meet its own notice duties.`]],
      ["Transfers", [`Client data is held in the United States. Where a client&rsquo;s data comes from a place whose law restricts transfers, the parties rely on the standard contractual clauses approved for that purpose, which are incorporated here by reference, or another lawful mechanism.`]],
      ["Return and deletion", [`At the end of the engagement, or at any time the client asks, we return the client&rsquo;s data in a common format and delete it, within 30 days of the request, and confirm in writing. The exceptions are in the <a href="/data-retention">retention and deletion page</a>.`]],
      ["Use of data to improve our service", [`We do not use client data to improve our models or service except in the de-identified and aggregated way described in the <a href="/ai-and-model-improvement">AI and model improvement policy</a>. A client may opt out in its agreement or by writing to us.`]],
      ["California service provider terms", [`We do not sell or share a client&rsquo;s personal information, we do not keep, use or disclose it outside our direct business relationship with the client or for any purpose other than the services, and we do not combine it with information from other sources, except as the law allows. We will tell the client if we can no longer meet these duties.`]],
      ["Audits", [`We will give the client the information reasonably needed to show we are following this addendum, and will contribute to a reasonable audit, once a year or after a breach, at a time agreed in advance and under confidentiality.`]],
    ],
  },
  {
    file: "data-retention.html", path: "/data-retention", title: "Retention and deletion",
    desc: "What LOVELEEDAY keeps, for how long, and what is deleted when you ask or when an engagement ends.",
    h1: "How long we keep things, and how deletion works.", lede: "What is kept, for how long, and what is removed when you ask or when the work ends.",
    sections: [
      ["Notes and briefs", [`Notes and project briefs sent through this site stay in our mailbox while we are in conversation, and are deleted within 24 months after the last message unless you become a client.`]],
      ["Private review pages", [`Page-open records and Ask Arthur questions are deleted when you ask, and in any case within 24 months after our last contact with the organization the page was prepared for.`]],
      ["Client data during the work", [
        `Arthur reads the systems you connect and leaves them in place. They remain your systems of record, so your own bookkeeping, business and statutory records stay where they are, under your control. If a law requires you to keep certain records, keep them in those systems, or take an export first.`,
        `We keep copies and working data only as long as the work needs them.`]],
      ["When the work ends or you ask", [
        `At the end of an engagement, or whenever you ask, we remove our connections to your systems, return your data to you in a common format if you want it, and delete it. We complete deletion within 30 days of your request and confirm in writing.`,
        `Take your export first. Once we have deleted data, we cannot get it back.`]],
      ["What deletion covers", [
        `Your data in our working systems, the records made from it, and the copies held by our subprocessors for the engagement. Backups are not restored except to recover from a failure, age out on the hosting provider&rsquo;s own schedule, and if one is ever restored, the deletion is applied again.`]],
      ["What we may keep", [
        `Our own business records of the relationship, such as the agreement, invoices and correspondence about the work, and anything we are legally required to keep or need to keep to defend a legal claim. We keep these separate from your data, use them only for those purposes, and hold anything caught by a legal hold until the hold ends.`,
        `De-identified, aggregated information that can no longer be tied to you is not your data and may remain, as the <a href="/ai-and-model-improvement">AI and model improvement policy</a> explains. If you opt out, none of your data is used that way.`]],
      ["How to ask", [`Email ${E} from the address on your engagement, say what you want deleted, and we will reply with what we need, if anything, and then confirm in writing when it is done. Individuals who wrote to us through the site can use the same address.`]],
    ],
  },
  {
    file: "ai-and-model-improvement.html", path: "/ai-and-model-improvement", title: "AI and model improvement",
    desc: "How LOVELEEDAY uses AI on your data, and the narrow, de-identified way data may improve the service.",
    h1: "How AI uses your data, and what it never does.", lede: "What may improve our models and service, what never will, and how to opt out.",
    sections: [
      ["The short version", [
        `Your data is used to answer your questions. It is not used to train anyone&rsquo;s models in a form that identifies you, and it is never sold. The one narrow use we may make is to learn from information that has first been stripped of anything that identifies you or anyone you deal with and combined with information from many other organizations.`]],
      ["How AI is used on your data", [
        `Arthur uses language models to read records and write answers. For that, the text needed for the question is sent to the model provider that runs the model for us, which handles it only to return an answer. The providers are on the <a href="/subprocessors">subprocessor list</a> and, for client work, in the engagement.`,
        `We do not send client data to a provider for the purpose of training, and we do not opt in to any provider program that would let a provider train on it.`]],
      ["What we may use to improve the service", [
        `Information that has been de-identified and aggregated: combined counts, patterns and measurements about how the service performs, with the identifying details removed, drawn from many organizations at once. We may use it to improve our models, our service and our own research.`]],
      ["What we never use", [
        `We never use the following to train or improve models, for any client, in any form that could be tied back to it:`,
        `Anything that identifies a client, a person, or the people and companies a client deals with. Account, routing and card numbers. Passwords, keys and other credentials. The identity of a supplier or vendor and its banking or pricing terms. Personal information about employees, including pay. The contents of documents tied to an identifiable client or supplier.`,
        `We do not sell data, and we do not give or license it to a third party to train theirs.`]],
      ["How de-identification works", [
        `Before anything is used to improve the service, names, contact details, identifiers, account numbers and free-text details are removed, and the names of clients, suppliers and vendors are replaced with general categories. The results are combined across many organizations, and small groups that could point to one organization are left out. We do not try to re-identify de-identified information and we do not allow anyone else to.`]],
      ["Opting out", [
        `A client can opt out of even this narrow use in its written agreement, or at any time by writing to ${E}. After an opt-out, none of that client&rsquo;s data is used to improve our models or service, including in de-identified form, from the date we confirm it.`]],
      ["Questions and changes", [
        `This policy sits alongside ${POLICIES}. If we change it in a way that widens what we may use, we will say so here and tell clients in writing before the change takes effect. Questions to ${E}.`]],
    ],
  },
  {
    file: "subprocessors.html", path: "/subprocessors", title: "Subprocessors",
    desc: "The service providers that handle information for LOVELEEDAY through this site, and what each one does.",
    h1: "The providers that handle information for us.", lede: "Who handles information on our behalf through this site, and why.",
    sections: [
      ["How to read this list", [
        `A subprocessor is a company we use that may handle personal information in order to provide our service. This list covers this website and its private review pages. Work for a client runs on infrastructure we confirm with that client before it starts, and the providers for the engagement are named in its agreement.`]],
      ["Hosting and delivery", [
        `<strong>Vercel</strong>: hosts this site and runs its form and Ask Arthur code, and keeps standard request logs. United States.`,
        `<strong>Cloudflare</strong>: routes traffic to the site for speed and protection, so visitor requests pass through its network.`]],
      ["Email", [
        `<strong>Resend</strong>: sends the confirmation and alert emails that our forms trigger, so it handles the name, address and message sent through a form.`,
        `<strong>Mailbox provider</strong>: holds the mailbox at ${E}, where each note, brief and our replies are kept.`]],
      ["Private review pages", [
        `<strong>Database provider</strong>: stores page-open records and Ask Arthur questions from private review pages.`,
        `<strong>Arthur&rsquo;s hosted service</strong>: run by LOVELEEDAY. It receives an Ask Arthur question with the page&rsquo;s own material and returns the answer.`,
        `<strong>Cerebras</strong>: a language model provider. If Arthur&rsquo;s hosted service is unavailable, the question and the page&rsquo;s material go to Cerebras to answer it.`]],
      ["Changes", [`We update this list before a new provider starts handling information. Clients under a data processing addendum are told in writing first, as <a href="/data-processing">the addendum</a> describes. To ask about a provider, write to ${E}.`]],
    ],
  },
];

const cur = fs.readFileSync(path.join(site, "privacy.html"), "utf8");
const old = {
  title: cur.match(/<title>([^<]*)<\/title>/)[1],
  desc: cur.match(/<meta name="description" content="([^"]*)"/)[1],
};
const oldCanon = cur.match(/<link rel="canonical" href="([^"]*)"/)[1];
const head = cur.slice(0, cur.indexOf("<main"));
const tail = cur.slice(cur.indexOf("</main>") + "</main>".length);
const attr = (s) => s.replace(/&ldquo;|&rdquo;/g, "").replace(/&rsquo;/g, "’").replace(/&/g, "&amp;").replace(/"/g, "&quot;");
const split = ([h, ps]) => `    <div class="ob-split">\n      <h2>${h}</h2>\n      <div class="ob-prose">\n${ps.map((p) => `        <p>${p}</p>`).join("\n")}\n      </div>\n    </div>`;


for (const p of pages) {
  const t = `${p.title} — LOVELEEDAY`;
  const url = `https://loveleedaystudios.com${p.path}`;
  let h = head.split(old.title).join(attr(t)).split(old.desc).join(attr(p.desc)).split(oldCanon).join(url);
  h = h.split(`content="${oldCanon}"`).join(`content="${url}"`);
  const main = `<main id="main">
<section class="ob-lead">
  <div class="ob-wrap">
    <h1 class="ob-h1">${p.h1}</h1>
    <p class="ob-lede">${p.lede}</p>
  </div>
</section>

<section class="ob-sec" style="padding-top:clamp(24px,3vw,48px)">
  <div class="ob-wrap">
    <div class="ob-split" style="border-top:0">
${split(p.sections[0]).split("\n").slice(1).join("\n")}
${p.sections.slice(1).map(split).join("\n")}
    <p class="ob-meta" style="margin-top:clamp(24px,3vw,48px)">Updated ${DATE} · Questions to ${E}</p>
  </div>
</section>
`;
  const out = h + main + "</main>" + tail;
  const f = path.join(site, p.file);
  const before = fs.existsSync(f) ? fs.readFileSync(f, "utf8") : "";
  if (before !== out) { fs.writeFileSync(f, out); console.log("wrote " + p.file); }
}

