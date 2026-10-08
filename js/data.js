/* ==========================================================================
   Site content that changes often. Edit here — no HTML changes needed.
   ========================================================================== */

// Contact + social links used in every footer.
// TODO: replace with the club's real email / handles before launch.
window.BCA_CONTACT = {
  email: "bruincapitaladvisory@gmail.com",
  instagram: "https://www.instagram.com/",
  linkedin: "https://www.linkedin.com/",
};

// Sectors used as filter tabs on the Reports page.
window.BCA_SECTORS = ["Healthcare", "TMT", "Wealth Management"];

// Reports / newsletters. Newest first. The first three also appear in the
// homepage carousel. `url` can point to a PDF in /reports or a Google Doc.
// Leave the array empty and the site shows a "coming soon" message instead.
window.BCA_REPORTS = [
  // {
  //   title: "Example: Why mid-market private credit keeps growing",
  //   sector: "Healthcare", // must match one of BCA_SECTORS above
  //   date: "2026-10-01",
  //   summary: "One-paragraph teaser shown on the card.",
  //   url: "reports/example.pdf",
  // },
];

// Projects shown on the Projects page. Newest first. `url` is optional (a PDF,
// deck, or Google Doc). Leave the array empty to show a "coming soon" message.
window.BCA_PROJECTS = [
  // {
  //   title: "Example: LBO model for a mid-market healthcare services company",
  //   type: "Modeling",          // short label, e.g. Modeling, Stock Pitch, Competition
  //   date: "2026-10-01",
  //   summary: "One-paragraph description shown on the card.",
  //   team: "First Last, First Last",
  //   url: "projects/example.pdf",
  // },
];

// Board members. PLACEHOLDERS — replace each name/role, drop a square headshot
// in assets/team/ and set `photo` to it. Without `photo`, a "photo coming soon"
// silhouette is shown. Add `linkedin` to show a LinkedIn link under the name.
window.BCA_TEAM = [
  { name: "Member Name", role: "Co-President" },
  { name: "Member Name", role: "Co-President" },
  { name: "Member Name", role: "Vice President" },
  { name: "Member Name", role: "Vice President" },
  { name: "Member Name", role: "Director of Quant" },
  { name: "Member Name", role: "Director of Investment Banking" },
  { name: "Member Name", role: "Director of Wealth Management" },
  { name: "Member Name", role: "Director of Newsletters" },
  // { name: "First Last", role: "Co-President", photo: "assets/team/first-last.jpg", linkedin: "https://www.linkedin.com/in/..." },
];
