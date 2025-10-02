import Navbar from "./components/navbar/Navbar";
import PropertyList from "./components/properties/PropertyList";

export default function Home() {
  return (
    <>
      <Navbar />
      <PropertyList />
      <PropertyList />
      <PropertyList />
    </>
  );
}
