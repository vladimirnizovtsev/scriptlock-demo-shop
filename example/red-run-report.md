## Scriptlock diff: checkout (drift)

URL: https://vladimirnizovtsev.github.io/scriptlock-demo-shop/checkout.html  
Scanned: 2026-09-03T06:35:46.425Z  
Scripts: 10 observed (9 merchant), 9 approved

**Result: 1 fail, 0 warn, 1 info; exit code 1 (findings at fail severity).**

| Type | Severity | Scope | Subject | Message |
|---|---|---|---|---|
| new | fail | merchant | `https://cdn.jsdelivr.net/gh/vladimirnizovtsev/scriptlock-demo-tags@main/audience-pixel.js` | unapproved external script in merchant scope (JSDelivr CDN), loaded by https://vladimirnizovtsev.github.io/scriptlock-demo-tags/container.js |

<details>
<summary>1 informational event</summary>

| Type | Severity | Scope | Subject | Message |
|---|---|---|---|---|
| changed | info | merchant | `https://vladimirnizovtsev.github.io/scriptlock-demo-tags/container.js` | body changed under track policy (informational): 5523efa46248 -> f7708b31366e |

</details>
