import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Content from "./components/Content";
import CTA from "./components/CTA";

export default function Home() {
  return (
    <>
      <main itemScope itemType="https://schema.org/Person">
        <Hero />
        <About />
        <Services />
        <Content />
        <CTA />
      </main>
    </>
  );
}
