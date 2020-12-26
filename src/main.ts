// import { ApolloClient, InMemoryCache } from '@apollo/client'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// const client = new ApolloClient({
//   uri: 'http://127.0.0.1:5000/graphql',
//   cache: new InMemoryCache(),
// })

createApp(App)
  .use(router)
  .mount('#app')

// const getTypes = (item: object[]) =>
//   item.reduce((acc: any, item: any) => {
//     for (const key in item) {
//       if (!(key in acc)) {
//         acc[key] = []
//       }
//       const type = typeof item[key]
//       if (!acc[key].includes(type)) {
//         acc[key].push(type)
//       }
//     }
//     return acc
//   }, {})

// setTimeout(() => ipcRenderer.invoke('test').then(console.log), 2000)

// import { ipcRenderer } from 'electron'

// ipcRenderer.on('test', e => console.log(e))

import { parse } from 'fast-xml-parser'

console.log(
  parse(`<rss xmlns:blogChannel="http://backend.userland.com/blogChannelModule" version="2.0">
<channel>
<title>Scripting News</title>
<link>http://www.scripting.com/</link>
<description>A weblog about scripting and stuff like that.</description>
<language>en-us</language>
<blogChannel:blogRoll>http://radio.weblogs.com/0001015/userland/scriptingNewsLeftLinks.opml</blogChannel:blogRoll>
<blogChannel:mySubscriptions>http://radio.weblogs.com/0001015/gems/mySubscriptions.opml</blogChannel:mySubscriptions>
<blogChannel:blink>http://diveintomark.org/</blogChannel:blink>
<copyright>Copyright 1997-2002 Dave Winer</copyright>
<lastBuildDate>Mon, 30 Sep 2002 11:00:00 GMT</lastBuildDate>
<docs>http://backend.userland.com/rss</docs>
<generator>Radio UserLand v8.0.5</generator>
<category domain="Syndic8">1765</category>
<managingEditor>dave@userland.com</managingEditor>
<webMaster>dave@userland.com</webMaster>
<ttl>40</ttl>
<item>
<description>"rssflowersalignright"With any luck we should have one or two more days of namespaces stuff here on Scripting News. It feels like it's winding down. Later in the week I'm going to a <a href="http://harvardbusinessonline.hbsp.harvard.edu/b02/en/conferences/conf_detail.jhtml?id=s775stg&pid=144XCF">conference</a> put on by the Harvard Business School. So that should change the topic a bit. The following week I'm off to Colorado for the <a href="http://www.digitalidworld.com/conference/2002/index.php">Digital ID World</a> conference. We had to go through namespaces, and it turns out that weblogs are a great way to work around mail lists that are clogged with <a href="http://www.userland.com/whatIsStopEnergy">stop energy</a>. I think we solved the problem, have reached a consensus, and will be ready to move forward shortly.</description>
<pubDate>Mon, 30 Sep 2002 01:56:02 GMT</pubDate>
<guid>http://scriptingnews.userland.com/backissues/2002/09/29#When:6:56:02PM</guid>
</item>
<item>
<description>Joshua Allen: <a href="http://www.netcrucible.com/blog/2002/09/29.html#a243">Who loves namespaces?</a></description>
<pubDate>Sun, 29 Sep 2002 19:59:01 GMT</pubDate>
<guid>http://scriptingnews.userland.com/backissues/2002/09/29#When:12:59:01PM</guid>
</item>
<item>
<description><a href="http://www.docuverse.com/blog/donpark/2002/09/29.html#a68">Don Park</a>: "It is too easy for engineer to anticipate too much and XML Namespace is a frequent host of over-anticipation."</description>
<pubDate>Mon, 30 Sep 2002 01:52:02 GMT</pubDate>
<guid>http://scriptingnews.userland.com/backissues/2002/09/29#When:6:52:02PM</guid>
</item>
<item>
<description><a href="http://scriptingnews.userland.com/stories/storyReader$1768">Three Sunday Morning Options</a>. "I just got off the phone with Tim Bray, who graciously returned my call on a Sunday morning while he was making breakfast for his kids." We talked about three options for namespaces in RSS 2.0, and I think I now have the tradeoffs well outlined, and ready for other developers to review. If there is now a consensus, I think we can easily move forward. </description>
<pubDate>Sun, 29 Sep 2002 17:05:20 GMT</pubDate>
<guid>http://scriptingnews.userland.com/backissues/2002/09/29#When:10:05:20AM</guid>
</item>
<item>
<description><a href="http://blog.mediacooperative.com/mt-comments.cgi?entry_id=1435">Mark Pilgrim</a> weighs in behind option 1 on a Ben Hammersley thread. On the RSS2-Support list, Phil Ringnalda lists a set of <a href="http://groups.yahoo.com/group/RSS2-Support/message/54">proposals</a>, the first is equivalent to option 1. </description>
<pubDate>Sun, 29 Sep 2002 19:09:28 GMT</pubDate>
<guid>http://scriptingnews.userland.com/backissues/2002/09/29#When:12:09:28PM</guid>
</item>
<item>
<description><a href="http://effbot.org/zone/effnews-4.htm">Fredrik Lundh breaks</a> through, following Simon Fell's lead, now his Python aggregator works with Scripting News <a href="http://www.scripting.com/rss.xml">in</a> RSS 2.0. BTW, the spec is imperfect in regards to namespaces. We anticipated a 2.0.1 and 2.0.2 in the Roadmap for exactly this purpose. Thanks for your help, as usual, Fredrik. </description>
<pubDate>Sun, 29 Sep 2002 15:01:02 GMT</pubDate>
<guid>http://scriptingnews.userland.com/backissues/2002/09/29#When:8:01:02AM</guid>
</item>
<item>
<title>Law and Order</title>
<link>http://scriptingnews.userland.com/backissues/2002/09/29#lawAndOrder</link>
<description> <p><a href="http://www.nbc.com/Law_&_Order/index.html"><img src="http://radio.weblogs.com/0001015/images/2002/09/29/lenny.gif" width="45" height="53" border="0" align="right" hspace="15" vspace="5" alt="A picture named lenny.gif"></a>A great line in a recent Law and Order. Lenny Briscoe, played by Jerry Orbach, is interrogating a suspect. The suspect tells a story and reaches a point where no one believes him, not even the suspect himself. Lenny says: "Now there's five minutes of my life that's lost forever." </p> </description>
<pubDate>Sun, 29 Sep 2002 23:48:33 GMT</pubDate>
<guid>http://scriptingnews.userland.com/backissues/2002/09/29#lawAndOrder</guid>
</item>
<item>
<title>Rule 1</title>
<link>http://scriptingnews.userland.com/backissues/2002/09/29#rule1</link>
<description> <p>In the discussions over namespaces in RSS 2.0, one thing I hear a lot of, that is just plain wrong, is that when you move up by a major version number, breakage is expected and is okay. In the world I come from it is, emphatically, <i>not okay.</i> We spend huge resources to make sure that files, scripts and apps built in version N work in version N+1 without modification. Even the smallest change in the core engine can break apps. It's just not acceptable. When we make changes we have to be sure there's no breakage. I don't know where these other people come from, or if they make software that anyone uses, but the users I know don't stand for that. As we expose the tradeoffs it becomes clear that <i>that's the issue here.</i> We are not in Year Zero. There are users. Breaking them is not an option. A conclusion to lift the confusion: Version 0.91 and 0.92 files are valid 2.0 files. This is where we started, what seems like years ago.</p> <p>BTW, you can ask anyone who's worked for me in a technical job to explain rules 1 and 1b. (I'll clue you in. Rule 1 is "No Breakage" and Rule 1b is "Don't Break Dave.")</p> </description>
<pubDate>Sun, 29 Sep 2002 17:24:20 GMT</pubDate>
<guid>http://scriptingnews.userland.com/backissues/2002/09/29#rule1</guid>
</item>
<item>
<title>Really early morning no-coffee notes</title>
<link>http://scriptingnews.userland.com/backissues/2002/09/29#reallyEarlyMorningNocoffeeNotes</link>
<description> <p>One of the lessons I've learned in 47.4 years: When someone accuses you of a <a href="http://www.dictionary.com/search?q=deceit">deceit</a>, there's a very good chance the accuser practices that form of deceit, and a reasonable chance that he or she is doing it as they point the finger. </p> <p><a href="http://www.docuverse.com/blog/donpark/2002/09/28.html#a66">Don Park</a>: "He poured a barrel full of pig urine all over the Korean Congress because he was pissed off about all the dirty politics going on."</p> <p><a href="http://davenet.userland.com/1995/01/04/demoingsoftwareforfunprofi">1/4/95</a>: "By the way, the person with the big problem is probably a competitor."</p> <p>I've had a fair amount of experience in the last few years with what you might call standards work. XML-RPC, SOAP, RSS, OPML. Each has been different from the others. In all this work, the most positive experience was XML-RPC, and not just because of the technical excellence of the people involved. In the end, what matters more to me is <a href="http://www.dictionary.com/search?q=collegiality">collegiality</a>. Working together, person to person, for the sheer pleasure of it, is even more satisfying than a good technical result. Now, getting both is the best, and while XML-RPC is not perfect, it's pretty good. I also believe that if you have collegiality, technical excellence follows as a natural outcome.</p> <p>One more bit of philosophy. At my checkup earlier this week, one of the things my cardiologist asked was if I was experiencing any kind of intellectual dysfunction. In other words, did I lose any of my sharpness as a result of the surgery in June. I told him yes I had and thanked him for asking. In an amazing bit of synchronicity, the next day John Robb <a href="http://jrobb.userland.com/2002/09/25.html#a2598">located</a> an article in New Scientist that said that scientists had found a way to prevent this from happening. I hadn't talked with John about my experience or the question the doctor asked. Yesterday I was telling the story to my friend Dave Jacobs. He said it's not a problem because I always had excess capacity in that area. Exactly right Big Dave and thanks for the vote of confidence.</p> </description>
<pubDate>Sun, 29 Sep 2002 11:13:10 GMT</pubDate>
<guid>http://scriptingnews.userland.com/backissues/2002/09/29#reallyEarlyMorningNocoffeeNotes</guid>
</item>
</channel>
</rss>`),
)
