import CreativeVideoSection from "@/components/CreativeVideoSection";
import Footer from "@/components/Footer";
import FormSec from "@/components/FormSec";
import Header from "@/components/Header";
import HeroSec from "@/components/HeroSec";
import ImgSecs from "@/components/ImgSecs";
import KnowSec from "@/components/KnowSec";
import ProductSec from "@/components/ProductSec";
import TestimonialSec from "@/components/TestimonialSec";
import WatchSec from "@/components/WatchSec";

export default function Home() {
  return (
    <>
   <Header />
   <HeroSec />
   <KnowSec />
   <ProductSec />
   <ImgSecs />
    <CreativeVideoSection />
   <WatchSec />
   <TestimonialSec />
   <FormSec />
   <Footer />
    </>
  );
}
