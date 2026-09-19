import css from "./LoadMoreBtn.module.css";

interface loadMoreButtonProps {
  fetchNextPage: () => Promise<unknown>;
  isFetchingNextPage: boolean;
}

export default function LoadMoreBtn({
  fetchNextPage,
  isFetchingNextPage,
}: loadMoreButtonProps) {
  return (
    <div className={css.loadMoreWrapper}>
      <button
        type="button"
        className={css.loadMoreButton}
        onClick={() => fetchNextPage()}
        disabled={isFetchingNextPage}
      >
        {isFetchingNextPage ? "Loading..." : "Load more"}
      </button>
    </div>
  );
}
