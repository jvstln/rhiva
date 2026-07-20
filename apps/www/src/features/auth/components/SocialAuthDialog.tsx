import { Button } from "@/components/ui/button";
import {
  createDialogHandle,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { SimpleIcon } from "@/components/ui/icons";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useLoginWithOAuth } from "@privy-io/react-auth";
import { ArrowUpRight, ChevronLeft, Mail, Waves } from "lucide-react";
import { useState } from "react";
import { siApple, siGoogle, siX } from "simple-icons";

type SocialAuthDialogProps = Dialog.Props & { children?: React.ReactElement };

const dialogHandle = createDialogHandle();

export const SocialAuthDialog = ({
  children,
  ...props
}: SocialAuthDialogProps) => {
  const [step, setStep] = useState<"login" | "email">("login");

  return (
    <Dialog
      {...props}
      handle={dialogHandle}
    >
      {children && <DialogTrigger render={children} />}
      <DialogContent>
        <DialogHeader>
          <div className="flex relative items-center gap-2">
            {step === "email" && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setStep("login")}
                className="absolute bottom-1/2 "
              >
                <ChevronLeft />
              </Button>
            )}
            <DialogTitle className="text-center mx-auto">
              Social Login
            </DialogTitle>
          </div>
        </DialogHeader>

        {step === "login" && (
          <SocialLoginStep onGetStarted={() => setStep("email")} />
        )}
        {step === "email" && <EmailStep />}
      </DialogContent>
    </Dialog>
  );
};

function SocialLoginStep({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div className="space-y-3">
      <SocialButtons />

      <p className="pt-2 text-center text-muted-foreground text-sm">
        Haven't got a wallet?{" "}
        <button
          type="button"
          onClick={onGetStarted}
          className="link"
        >
          Get started
        </button>
      </p>
    </div>
  );
}

function EmailStep() {
  return (
    <div className="space-y-3">
      <Field>
        <InputGroup>
          <InputGroupInput placeholder="Email" />
          <InputGroupAddon align="inline-start">
            <Mail />
          </InputGroupAddon>
        </InputGroup>
      </Field>

      <SocialButtons />

      <div className="flex items-center gap-3 py-1">
        <span className="h-px flex-1 bg-border" />
        <span className="text-muted-foreground text-sm">or</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <p className="text-center text-muted-foreground text-sm">
        Looking for a self-custody wallet?
      </p>

      <button
        type="button"
        className="mx-auto flex items-center gap-2 rounded-full bg-surface-2 px-5 py-2.5 text-foreground text-sm transition-colors hover:bg-surface-3"
      >
        <Waves className="size-4" />
        Find on WalletGuide
        <ArrowUpRight className="size-4" />
      </button>
    </div>
  );
}

function SocialButtons() {
  const { initOAuth, loading } = useLoginWithOAuth({
    onError: (err) => console.error("OAuth failed: ", err),
    onComplete: () => dialogHandle.close(),
  });

  return (
    <div className="space-y-3">
      <Button
        variant="outline"
        className="w-full"
        loading={loading}
        onClick={() => initOAuth({ provider: "google" })}
      >
        <SimpleIcon icon={siGoogle} />
        Continue With Google
      </Button>

      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          loading={loading}
          onClick={() => initOAuth({ provider: "twitter" })}
        >
          <SimpleIcon
            icon={siX}
            className="text-foreground"
          />
        </Button>
        <Button
          variant="outline"
          loading={loading}
          onClick={() => initOAuth({ provider: "apple" })}
        >
          <SimpleIcon
            icon={siApple}
            className="text-foreground"
          />
        </Button>
      </div>
    </div>
  );
}
