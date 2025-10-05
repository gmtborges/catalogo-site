import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
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
  const [otp, setOtp] = useState("");
  const [currentStep, setCurrentStep] = useState<LoginStep>("email");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await pb.collection("users").requestOTP(email);
      setCurrentStep("otp");
    } catch (err: any) {
      setError(err.message || "Falha ao enviar OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const req = await pb.collection("users").requestOTP(email);
      const authData = await pb.collection("users").authWithOTP(req.otpId, otp);
      console.log(authData.record.id);
    } catch (err: any) {
      setError(err.message || "OTP inválido");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setCurrentStep("email");
    setOtp("");
    setError("");
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    setError("");

    try {
      await pb.collection("users").requestOTP(email);
    } catch (err: any) {
      setError(err.message || "Falha ao reenviar OTP");
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
                ? "Entrar com código OTP"
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
                  {isLoading
                    ? "Enviando OTP..."
                    : "Enviar código de verificação"}
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
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                      className="text-center text-lg tracking-widest"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading || otp.length < 6}
                  >
                    {isLoading ? "Verificando..." : "Verificar código"}
                  </Button>
                </form>

                <div className="flex flex-col space-y-2 text-center text-sm">
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    className="text-primary hover:text-primary/80"
                    disabled={isLoading}
                  >
                    Reenviar código de verificação
                  </button>
                  <button
                    type="button"
                    onClick={handleBackToEmail}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Usar email diferente
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
