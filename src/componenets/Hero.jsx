import WalletButton from "./WalletButton";

export default function Hero() {
  return (
    <section id="home" className="hero">
      <h1>Modern Web3 Experience</h1>

      <p>
        Connect your Ethereum wallet and explore a
        lightweight, performance-focused landing page
        built with React.
      </p>

      <WalletButton />
    </section>
  );
}