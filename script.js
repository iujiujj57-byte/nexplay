import { initializeApp } from "https://www.gstatic.com/firebasejs/13.3.0/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithEmailAndPassword, signOut, sendEmailVerification } from "https://www.gstatic.com/firebasejs/13.3.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, deleteDoc, collection, getDocs, serverTimestamp, onSnapshot } from "https://www.gstatic.com/firebasejs/13.3.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCz7gweuP0E9-jXUjbyXMOlWeIHT4Bn8",
  authDomain: "nexplay-1029b.firebaseapp.com",
  projectId: "nexplay-1029b",
  storageBucket: "nexplay-1029b.firebasestorage.app",
  messagingSenderId: "288990411835",
  appId: "1:288990411835:web:f1a0697b6c4042fd3eb01e",
  measurementId: "G-7DKFNYY8L9"
};
const ADMIN_EMAIL = "arehq@schools.vic.edu.au";
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const sites = [
  ["Radon Games","https://mathclass.vercel.app/","games","☢️","An open-source browser games site."],
  ["Classic HTML5 Games","https://tommalbran.github.io/games/","community","🕹️","Snake, Tetris, Pacman and other classic arcade games."],
  ["GitHub Classic Games","https://dasper.github.io/github-games","community","👾","A collection of classic open-source games."],
  ["Unblocked Gaming","https://bio.link/unblockedgaming","community","🔗","A link page of games and mirrors."],
  ["PeteZah","https://999hourly.cfd/","other","🎯","An external games page."],
  ["Soupcan Games","https://soupcan.pages.dev/g","games","🥫","A collection of browser games to explore."],
  ["Kylebob","https://kylebob.com/","games","🅺","A browser game site."],
  ["Chicken Kings Vault","https://wanocapy.github.io/ChickenKingsVault/","games","🐔","Explore the Chicken Kings Vault."],
  ["Coolmath Games","https://www.coolmathgames.com/","games","🌐","Puzzles, strategy and casual games."],
  ["Levitr","https://f3a4e576.levitr.cfd/","other","↗","An external link; check the address before opening."],
  ["Fern","https://s3.amazonaws.com/frnbk/index.html","other","🌿","An external link hosted on Amazon S3."],
  ["Azure Link","https://wzf9.z19.web.core.windows.net/","other","☁️","An external link hosted on Microsoft Azure."],
  ["EduSecurify","https://blog.free-dyndns.org/","other","🎓","An external link with a study-themed landing page."],
  ["SVG File","https://cdn.jsdelivr.net/gh/homeworkpractive/svg@main/index.svg","other","SVG","An SVG file link."]
].map(([name,url,category,icon,description])=>({name,url,category,icon,description}));

const $ = (s) => document.querySelector(s);
const grid=$("#siteGrid"), search=$("#search"), emptyState=$("#emptyState"), resultCount=$("#resultCount");
const filterButtons=[...document.querySelectorAll("[data-filter]")];
const categoryNames={games:"Game Hub",community:"Community",other:"Other"};
let activeFilter="all", authReady=false, banUnsubscribe=null;
function safeHost(url){try{return new URL(url).hostname.replace(/^www\./,"")}catch{return url}}
function renderSites(){
 const query=search.value.trim().toLowerCase();
 const filtered=sites.filter(site=>{const match=activeFilter==="all"||site.category===activeFilter;return match&&`${site.name} ${site.description} ${safeHost(site.url)} ${categoryNames[site.category]}`.toLowerCase().includes(query)});
 grid.replaceChildren();
 for(const site of filtered){
  const card=document.createElement("article");card.className="site-card";
  const top=document.createElement("div");top.className="card-top";
  const icon=document.createElement("div");icon.className="site-icon";icon.textContent=site.icon;
  const ext=document.createElement("span");ext.className="external-mark";ext.textContent="↗";top.append(icon,ext);
  const title=document.createElement("h3");title.textContent=site.name;
  const tag=document.createElement("span");tag.className="category-tag";tag.textContent=categoryNames[site.category];
  const desc=document.createElement("p");desc.textContent=site.description;
  const link=document.createElement("a");link.className="open-link";link.href=site.url;link.target="_blank";link.rel="noopener noreferrer";link.textContent="Open Website →";
  card.append(top,title,tag,desc,link);grid.append(card);
 }
 emptyState.hidden=filtered.length!==0;grid.hidden=filtered.length===0;resultCount.textContent=`${filtered.length} ${filtered.length===1?"site":"sites"}`;
}
function setFilter(filter){activeFilter=filter;filterButtons.forEach(b=>{const yes=b.dataset.filter===filter;b.classList.toggle("active",yes);if(b.classList.contains("filter-chip"))b.setAttribute("aria-pressed",String(yes))});renderSites()}
const counts={all:sites.length,games:sites.filter(s=>s.category==="games").length,community:sites.filter(s=>s.category==="community").length,other:sites.filter(s=>s.category==="other").length};
for(const [key,id] of [["all","allCount"],["games","gamesCount"],["community","communityCount"],["other","otherCount"],["all","chipAll"],["games","chipGames"],["community","chipCommunity"],["other","chipOther"]])$("#"+id).textContent=counts[key];
$("#heroCount").textContent=`${counts.all} Links`;$("#year").textContent=new Date().getFullYear();
filterButtons.forEach(b=>b.addEventListener("click",()=>setFilter(b.dataset.filter)));search.addEventListener("input",renderSites);
$("#resetFilters").addEventListener("click",()=>{search.value="";setFilter("all")});
document.addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();search.focus()}if(e.key==="Escape"){if(document.activeElement===search){search.value="";renderSites();search.blur()}$("#adminPanel").hidden=true}});
renderSites();

function showGate(message=""){ $("#nameGate").hidden=false;$("#gateError").textContent=message; }
function stopBanWatch(){if(banUnsubscribe){banUnsubscribe();banUnsubscribe=null}}
async function checkVisitor(user){
 const banRef=doc(db,"bannedUsers",user.uid);const snap=await getDoc(banRef);
 if(snap.exists()){location.replace("banned.html");return false}
 stopBanWatch();banUnsubscribe=onSnapshot(banRef,s=>{if(s.exists())location.replace("banned.html")},err=>console.error("Ban status listener:",err));return true;
}
onAuthStateChanged(auth,async user=>{
 if(!user){try{await signInAnonymously(auth)}catch(err){console.error(err);showGate("Could not start visitor access. Check Firebase Anonymous sign-in is enabled.")}return}
 if(!user.isAnonymous){return}
 try{
  if(!(await checkVisitor(user)))return;
  const profileRef=doc(db,"profiles",user.uid);const profile=await getDoc(profileRef);
  if(profile.exists()){$("#nameGate").hidden=true;authReady=true}
  else showGate();
 }catch(err){console.error(err);showGate("Could not load your visitor profile. Check the Firestore rules and try again.")}
});
$("#nameForm").addEventListener("submit",async e=>{e.preventDefault();const name=$("#displayName").value.trim();const user=auth.currentUser;if(!user||!user.isAnonymous)return;
 if(name.length<2||name.length>20){$("#gateError").textContent="Use a name between 2 and 20 characters.";return}
 try{await setDoc(doc(db,"profiles",user.uid),{username:name,createdAt:serverTimestamp()});$("#nameGate").hidden=true;authReady=true}catch(err){console.error(err);$("#gateError").textContent="Could not save your name. Check the Firestore rules."}
});

$("#adminOpen").addEventListener("click",()=>{$("#adminPanel").hidden=false});$("#adminClose").addEventListener("click",()=>{$("#adminPanel").hidden=true});
$("#adminLogin").addEventListener("submit",async e=>{e.preventDefault();const msg=$("#adminMessage");msg.textContent="Signing in…";
 try{const credential=await signInWithEmailAndPassword(auth,$("#adminEmail").value.trim(),$("#adminPassword").value);if(credential.user.email!==ADMIN_EMAIL){await signOut(auth);throw new Error("This email is not authorised as the administrator.")}
  if(!credential.user.emailVerified){await sendEmailVerification(credential.user);await signOut(auth);throw new Error("Please verify the administrator email using the link sent to your inbox, then sign in again.")}
  msg.textContent="Signed in.";await loadVisitors();
 }catch(err){console.error(err);msg.textContent=err.message||"Sign-in failed. Check the email and password."}
});
async function loadVisitors(){
 $("#adminLogin").hidden=true;$("#visitorArea").hidden=false;const list=$("#visitorList");list.replaceChildren();
 try{const [profiles,bans]=await Promise.all([getDocs(collection(db,"profiles")),getDocs(collection(db,"bannedUsers"))]);const banned=new Set(bans.docs.map(d=>d.id));
  for(const p of profiles.docs){const data=p.data();const row=document.createElement("div");row.className="visitor-item";const info=document.createElement("div");const name=document.createElement("strong");name.textContent=data.username||"Unnamed visitor";const uid=document.createElement("small");uid.textContent=p.id;info.append(name,uid);const button=document.createElement("button");button.className="ban-button"+(banned.has(p.id)?" unban-button":"");button.textContent=banned.has(p.id)?"Unban":"Ban";button.addEventListener("click",async()=>{button.disabled=true;try{if(banned.has(p.id))await deleteDoc(doc(db,"bannedUsers",p.id));else await setDoc(doc(db,"bannedUsers",p.id),{uid:p.id,username:data.username||"Visitor",reason:"Access restricted by administrator",bannedAt:serverTimestamp()});await loadVisitors()}catch(err){console.error(err);$("#adminMessage").textContent="Action failed. Check administrator permissions."}finally{button.disabled=false}});row.append(info,button);list.append(row)}
  if(!profiles.size)list.textContent="No visitors have registered yet.";
 }catch(err){console.error(err);$("#adminMessage").textContent="Could not load visitors. Confirm this is the verified administrator account and Firestore rules are published."}
}
$("#adminSignOut").addEventListener("click",async()=>{await signOut(auth);$("#visitorArea").hidden=true;$("#adminLogin").hidden=false;$("#adminMessage").textContent="Signed out."});
