import { useEffect, useState } from "react";
import { Loading } from "./loading";

interface InfiniteScrollProps {
  children: React.ReactNode;
  loadMore: () => Promise<void>;
  hasMore: boolean;
  loading: boolean;
}

export function InfiniteScroll({
  children,
  loadMore,
  hasMore,
  loading,
}: InfiniteScrollProps) {
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching) {
          setIsFetching(true);
          loadMore().finally(() => setIsFetching(false));
        }
      },
      { threshold: 0.5 }
    );

    const observerTarget = document.querySelector("#infinite-scroll-target");
    if (observerTarget) {
      observer.observe(observerTarget);
    }

    return () => observer.disconnect();
  }, [hasMore, isFetching, loadMore]);

  return (
    <div>
      {children}
      <div id="infinite-scroll-target" />
      {loading && (
        <div className="mt-8">
          <Loading />
        </div>
      )}
    </div>
  );
}
