import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PocketBase from "pocketbase";

const pb = new PocketBase("http://127.0.0.1:8090");

export const Route = createFileRoute("/entrar")({
  component: RouteComponent,
});

type LoginStep = "email" | "otp";

function RouteComponent() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [otpID, setOTPID] = useState("");
  const [currentStep, setCurrentStep] = useState<LoginStep>("email");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCountdown > 0) {
      timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const requestOTP = await pb.collection("users").requestOTP(email);
      setOTPID(requestOTP.otpId);
      setCurrentStep("otp");
      setResendCountdown(60);
    } catch (err: any) {
      setError("Falha ao enviar senha única");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const authData = await pb.collection("users").authWithOTP(otpID, code);
      console.log(authData.record.id);
    } catch (err: any) {
      setError("senha única inválida");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    setError("");

    try {
      const requestOTP = await pb.collection("users").requestOTP(email);
      setOTPID(requestOTP.otpId);
      setResendCountdown(60);
    } catch (err: any) {
      setError("Falha ao reenviar senha única");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {currentStep === "email"
                ? "Entrar com senha de uso único"
                : "Digite o código de verificação"}
            </CardTitle>
            <CardDescription className="text-center">
              {currentStep === "email"
                ? "Digite seu email para receber uma senha única"
                : `Enviamos um código de verificação para ${email}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
                {error}
              </div>
            )}

            {currentStep === "email" ? (
              <form onSubmit={handleRequestOTP} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Digite seu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Enviando OTP..." : "Entrar"}
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="otp">Código de Verificação</Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="Digite o código"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      maxLength={6}
                      className="text-center text-lg tracking-wide"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading || code.length < 6}
                  >
                    {isLoading ? "Verificando..." : "Verificar código"}
                  </Button>
                </form>

                <div className="flex flex-col space-y-2 text-center text-sm">
                  <span className="text-muted-foreground">
                    {resendCountdown == 0
                      ? "Código expirado"
                      : `Código expira em ${resendCountdown}s`}
                  </span>
                  <Button
                    disabled={resendCountdown > 0}
                    variant="link"
                    onClick={handleResendOTP}
                  >
                    Reenviar código
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
