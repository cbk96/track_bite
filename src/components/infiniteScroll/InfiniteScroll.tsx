import {
  FC,
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { CaretUp } from "phosphor-react";

interface InfiniteScrollProps {
  loadMore: () => void;
  isLoading: boolean;
  hasMore: boolean;
  className?: string;
}

export const InfiniteScroll: FC<PropsWithChildren<InfiniteScrollProps>> = ({
  loadMore,
  isLoading,
  hasMore,
  children,
  className,
}) => {
  const observerTarget = useRef<HTMLDivElement | null>(null);
  const [scrollY, setScrollY] = useState(0);

  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      //console.log("isLoading : ", isLoading + " | hasMore : " + hasMore);
      if (entry.isIntersecting && !isLoading && hasMore) {
        //console.log("now loading....");
        loadMore();
      }
    },
    [loadMore, isLoading, hasMore]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    });
    const current = observerTarget.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [observerCallback]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    // 클린업 함수: 컴포넌트가 언마운트될 때 실행됨
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // const scrollToTop = () => {
  //   window.scrollTo({ top: 0 });
  // };

  return (
    <>
      <ul className={className}>{children}</ul>
      <div ref={observerTarget} className="h-[1px]"></div>
    </>
  );
};

export default InfiniteScroll;
