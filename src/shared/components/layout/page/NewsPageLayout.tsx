import React from "react";
import MainHeader from "../header/MainHeader";
import { Button } from "@/core/presentation/components/ui/button";
import SubHeader from "../header/SubHeader";
import NewsCard from "../../card/NewsCard";
import { ChevronRight } from "lucide-react";

const   NewsPageLayout = () => {
  return (
    <div className="bg-black relative">
      <SubHeader />
      <section className="max-w-7xl py-28 px-9 pt-56 min-h-screen mx-auto bg-cover bg-center">
        <div className="text-center space-y-4 flex flex-col items-center">
          <p className="text-7xl font-semibold tracking-tighter">News</p>
          <p className="text-2xl opacity-50">
            The latest product features, launches, <br /> and announcements.
          </p>
        </div>
        <div className="pt-20 flex flex-col gap-20">
          <NewsCard isHero />
          <div className="grid grid-cols-2 gap-12">
            <NewsCard />
            <NewsCard />
            <NewsCard />
            <NewsCard />
          </div>
          <div className="">
            <div className="w-full flex items-center justify-between gap-24">
              <p className="text-lg font-medium">More posts</p>
              <Button className="rounded-full -ml-3" variant={"ghost"}>
                View all <ChevronRight />{" "}
              </Button>
            </div>
            <hr className="border-t mt-4 mb-8" />
            <div className="grid grid-cols-3 gap-12">
              <NewsCard />
              <NewsCard />
              <NewsCard />
              <NewsCard />
              <NewsCard />
              <NewsCard />
              <NewsCard />
              <NewsCard />
              <NewsCard />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewsPageLayout;
