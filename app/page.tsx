import Hero from "./components/Hero";
import Services from "./components/Services";
import About from "./components/About";
import CTA from "./components/CTA";

export default function Home() {
  return (
    <>
      <main itemScope itemType="https://schema.org/Person">
        <Hero />
        <Services />
        <About />
        <CTA />
      </main>
    </>
  );
}
