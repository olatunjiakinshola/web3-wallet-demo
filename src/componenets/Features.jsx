const features = [
  {
    title: "Wallet Integration",
    desc: "Connect using Metamask"
  },
  {
    title: "Fast Performance",
    desc: "Optimized React components."
  },
  {
    title: "Responsive User Interface",
    desc: "Mobile-first layout."
  }
];

export default function Features() {
  return (
    <section className="features">
      {features.map((item) => (
        <div className="card" key={item.title}>
          <h3>{item.title}</h3>
          <p>{item.desc}</p>
        </div>
      ))}
    </section>
  );
}