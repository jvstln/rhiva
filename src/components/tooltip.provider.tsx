import {
  createTooltipHandle,
  Tooltip,
  TooltipContent,
  TooltipProvider,
} from "./ui/tooltip";

const CustomTooltipProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <TooltipProvider>
      <ButtonTooltipProvider />
      {children}
    </TooltipProvider>
  );
};

const buttonTooltipHandle = createTooltipHandle<{ content: React.ReactNode }>();

const ButtonTooltipProvider = () => {
  return (
    <Tooltip handle={buttonTooltipHandle}>
      {({ payload }) => {
        return (
          <TooltipContent side="bottom">{payload?.content}</TooltipContent>
        );
      }}
    </Tooltip>
  );
};

export { CustomTooltipProvider as TooltipProvider, buttonTooltipHandle };
