import { PHOTOGETUSER } from "@/app/api/route";
import PhotoGetItem from "@/components/PhotoGetItem";
import Image from "next/image";

export default async function PhotoPage({params}: {params: Promise<{ id: string }>}) {

    const { id } = await params;

    const photo = await PHOTOGETUSER(id)



  return (
    <div className="">
      <PhotoGetItem id={id} />
    </div>
  );
}