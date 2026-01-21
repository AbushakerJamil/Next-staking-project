# Staking DApp - Next.js + Wagmi + Viem

Modern token staking platform with real-time rewards and beautiful UI.

## ✨ Features

✅ Token staking with auto-rewards | ✅ 9 gradient toast notifications | ✅ 3-second auto-refresh  
✅ Responsive (Mobile/Desktop) | ✅ Admin panel (owner-only) | ✅ Smart error handling

## 📦 Installation

```bash
npm install wagmi viem @rainbow-me/rainbowkit @tanstack/react-query react-hot-toast lucide-react
npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p
```

## 🎯 Setup

1. Get WalletConnect ID: [cloud.walletconnect.com](https://cloud.walletconnect.com)
2. Update `contractAddresses.json`: Add your token & staking contract addresses
3. Wrap app with `<Providers>` and `<ToastProvider>`

## 💻 Usage

```jsx
import { useStaking } from "./hooks/useStaking";
import { useToast } from "./context/ToastContext";

function App() {
  const { tokenBalance, stakeTokens } = useStaking();
  const { notify } = useToast();

  const handleStake = async (amount) => {
    const id = notify.start("Staking...");
    try {
      await stakeTokens(amount);
      notify.complete(id, "Staked successfully!");
    } catch (error) {
      notify.fail(id, "Transaction failed");
    }
  };
}
```

## 🎨 Toast Types

**Processing** (Purple) • **Approve** (Pink) • **Complete** (Blue) • **Success** (Green)  
**Reject** (Pink-Yellow) • **Failed** (Red-Pink) • **Error** (Pink-Red) • **Warning** (Peach) • **Info** (Teal)

## 🔥 Key Files

| File                              | Description                                 |
| --------------------------------- | ------------------------------------------- |
| `useStaking-FINAL-WITH-ERRORS.js` | Staking hook with error handling            |
| `ToastContext-Responsive.jsx`     | Responsive toast notifications              |
| `AdminPanel.jsx`                  | Owner-only controls (approve/transfer/mint) |
| `LiveStatsCard.jsx`               | Real-time stats (3s refresh)                |

## 📖 Docs

`AUTO-REFRESH-GUIDE.md` • `TOAST-ID-EXPLAINED.md` • `TOAST-POSITIONING-GUIDE.md` • `COMPONENTS-README.md`

## 📱 Responsive

**Desktop:** Bottom 80% (left) | **Mobile:** Top center (auto-detect)

---

Made with ❤️ by [Your Name] | Next.js • Wagmi • Viem • RainbowKit
