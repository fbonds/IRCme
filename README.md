# IRCme

**The emote command Discord never gave you.**

Remember `/me`? Back when chat was green text on black screens, when MUDs were multiplayer and IRC was social media, there was a simple, beautiful command:

```
/me unsheathes his mass-produced broadsword
```

And the whole channel saw:

> *Gandalf_420 unsheathes his mass-produced broadsword*

No pop-ups. No parameter fields. No autocomplete menus. You just typed it, and it worked.

**IRCme brings that back to Discord.**

---

## How It Works

Type this in any channel where IRCme is installed:

```
/emote adjusts his mass-produced wizard hat
```

Your message disappears. In its place:

> ***YourName** adjusts his mass-produced wizard hat*

Your avatar. Your name. Your action. Clean and simple, the way it was always meant to be.

---

## Add IRCme to Your Server

**[→ Click here to invite IRCme](https://discord.com/oauth2/authorize?client_id=1477563698561286237&permissions=536946688&integration_type=0&scope=bot+applications.commands)**

Requires: Manage Webhooks, Send Messages, Read Message History, Manage Messages.

---

## For the Curious

IRCme is built with discord.js and runs on Railway. It listens for messages starting with `/emote`, deletes the original, and reposts via webhook using your display name and avatar. No data is stored. No messages are logged. It just emotes.

MIT Licensed. Fork it, break it, make it yours.

---

*For the ones who remember when chat rooms had soul.*
