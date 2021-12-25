import { request } from "https://cdn.skypack.dev/@octokit/request?dts";

const { data: issues } = await request("GET /repos/{owner}/{repo}/issues", {
  owner: "huygn",
  repo: "til",
});

// writes issue content to .md file, then use `pandoc` to convert to Emacs Org
async function writeIssue(issue: typeof issues[number]) {
  const [date] = issue.created_at.split("T");
  const tags = issue.labels
    .map((e) => (typeof e === "string" ? e : e.name))
    .join(":");
  const body = issue.body!;

  const fileName = `./files/${date}`;
  await Deno.writeTextFile(`${fileName}.md`, body);
  const p = Deno.run({
    cmd: ["pandoc", `${fileName}.md`, "--to=org"],
    stdout: "piped",
  });
  const orgBody = new TextDecoder().decode(await p.output());
  p.close();

  await Deno.writeTextFile(
    `${fileName}.org`,
    `:PROPERTIES:
:ID: ${issue.id}
:END:
#+title: ${date}
#+filetags: :${tags}:
* ${issue.title}
${orgBody}`
  );
}

for (const issue of issues) {
  await writeIssue(issue);
}
