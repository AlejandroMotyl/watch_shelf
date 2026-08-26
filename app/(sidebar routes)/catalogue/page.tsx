import Hero from "@/components/Hero/Hero";
import css from "./page.module.css";
import Trending from "@/components/Trending/Trending";
import ContinueWatch from "@/components/ContinueWatch/ContinueWatch";

export default function CataloguePage() {
  return (
    <>
      <Hero />
      <Trending />
      <ContinueWatch />
    </>
  );
}
