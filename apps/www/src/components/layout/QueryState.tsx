import type React from "react";
import { isValidElement } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import { AlertTriangle, FolderOpenIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyContent,
  EmptyDescription,
} from "../ui/empty";

type QueryStateProps<
  TData = unknown,
  TQuery extends Partial<UseQueryResult<TData>> | undefined = Partial<
    UseQueryResult<TData>
  >,
> = {
  query: TQuery;
  children?:
    | React.ReactNode
    | ((query: TQuery & { data: NonNullable<TData> }) => React.ReactNode);

  getIsLoading?: (query: TQuery) => boolean | React.ReactNode;
  getIsError?: (query: TQuery) => boolean | string | undefined;
  getIsEmpty?: (
    query: TQuery & { data: NonNullable<TData> },
  ) => boolean | string | EmptyStateProps;
};

type EmptyStateProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  cta?: React.ReactNode;
};

/**
 * Props for the ErrorState component.
 */
type ErrorStateProps = {
  /** The query object from TanStack Query containing error and status */
  query?: QueryStateProps["query"];
  /** Optional custom class names for styling specific parts of the component */
  classNames?: Partial<
    Record<"errorRoot" | "root" | "error" | "button", string>
  >;
  /** Custom error message. Overrides the default error message */
  errorMessage?: string;
};

/**
 * Displays an error message with a retry button.
 * Renders when a query fails.
 */
const ErrorState = ({
  query,
  errorMessage = "An error occurred",
}: ErrorStateProps) => {
  return (
    <div className="flex min-h-24 w-full items-center justify-center p-4">
      <Empty className="border-destructive/20 bg-destructive/5 shadow-sm">
        <EmptyMedia
          variant="icon"
          className="bg-destructive/10 text-destructive"
        >
          <AlertTriangle size={40} />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle className="text-destructive">
            Something went wrong
          </EmptyTitle>
          <EmptyDescription>
            {errorMessage ?? query?.error?.message} <br />
            Please try again or contact support if the problem persists.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button
            onClick={() => query?.refetch?.()}
            variant="outline"
          >
            Try Again
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
};

/**
 * Props for the LoadingState component.
 */
type LoadingStateProps = {
  /** Optional custom class names for styling */
  classNames?: Partial<Record<"loadingRoot" | "root", string>>;
  loadingText?: string;
};

/**
 * Displays a loading spinner centered in a container.
 */
const LoadingState = ({ classNames, loadingText }: LoadingStateProps) => {
  return (
    <div
      className={cn(
        "flex h-full min-h-24 w-full flex-col items-center justify-center gap-2 rounded-2xl p-2 text-center",
        classNames?.root,
        classNames?.loadingRoot,
      )}
    >
      <Spinner className="size-12" />
      {loadingText && <p className="animate-pulse text-sm">{loadingText}</p>}
    </div>
  );
};

function hasData<
  TData,
  TQuery extends Partial<UseQueryResult<TData>> = Partial<
    UseQueryResult<TData>
  >,
>(query: TQuery): query is TQuery & { data: NonNullable<TData> } {
  return query.data !== undefined && query.data !== null;
}

/**
 * A wrapper component that handles loading, error, and empty states for queries.
 * - Renders `LoadingState` if the query is pending or custom loading is active.
 * - Renders `ErrorState` if the query has failed or custom error is active.
 * - Renders an empty placeholder state if the custom empty check evaluates to true.
 * - Renders children or custom builder functions otherwise.
 */
export function QueryState<
  TData,
  TQuery extends Partial<UseQueryResult<TData>>,
>({
  query,
  getIsLoading,
  getIsError,
  getIsEmpty,
  children,
}: QueryStateProps<TData, TQuery>) {
  const possibleLoadingMessage = getIsLoading?.(query);
  const possibleErrorMessage = getIsError?.(query);
  const possibleEmptyMessage = hasData<TData>(query)
    ? getIsEmpty?.(query)
    : false;

  if (getIsLoading ? possibleLoadingMessage : query?.isPending) {
    if (isValidElement(possibleLoadingMessage)) return possibleLoadingMessage;

    return (
      <LoadingState
        loadingText={
          typeof possibleLoadingMessage === "string"
            ? possibleLoadingMessage
            : undefined
        }
      />
    );
  }

  if (getIsError ? possibleErrorMessage : query?.error || query?.isError) {
    return (
      <ErrorState
        query={query}
        errorMessage={
          typeof possibleErrorMessage === "string"
            ? possibleErrorMessage
            : undefined
        }
      />
    );
  }

  if (possibleEmptyMessage) {
    let title: React.ReactNode;
    let cta: React.ReactNode;
    let description: React.ReactNode;

    if (typeof possibleEmptyMessage === "boolean") {
      title = "No data available";
    } else if (typeof possibleEmptyMessage === "string") {
      title = possibleEmptyMessage;
    } else {
      ({ title, description, cta } = possibleEmptyMessage);
    }

    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Empty className="border-none bg-transparent">
          <EmptyHeader>
            <EmptyMedia className="relative">
              <FolderOpenIcon className="size-28 animate-pulse text-primary/80" />
              <div className="absolute inset-0 rounded-full bg-primary/5 blur-xl" />
            </EmptyMedia>
            {title && <EmptyTitle>{title}</EmptyTitle>}
            {description && <EmptyDescription>{description}</EmptyDescription>}
          </EmptyHeader>
          {cta && <EmptyContent>{cta}</EmptyContent>}
        </Empty>
      </div>
    );
  }

  if (!hasData<TData>(query)) return null;

  return typeof children === "function" ? children(query) : children;
}
