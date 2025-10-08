import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
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

export const Route = createFileRoute("/cadastrar")({
  component: RouteComponent,
});

type RegisterStep = "form" | "otp";

function RouteComponent() {
  const [code, setCode] = useState("");
  const [otpID, setOTPID] = useState("");
  const [currentStep, setCurrentStep] = useState<RegisterStep>("form");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);
  const navigate = useNavigate({ from: "/cadastrar" });

  // Form
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [cnpj, setCnpj] = useState("");

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCountdown > 0) {
      timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
    } catch (err: any) {
    } finally {
      setIsLoading(false);
    }

    const subdomainPattern = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
    const reservedNames = [
      "www",
      "api",
      "admin",
      "app",
      "mail",
      "ftp",
      "support",
      "help",
      "blog",
      "shop",
      "dashboard",
    ];

    if (!subdomain || subdomain.length < 3) {
      setError("Subdomínio deve ter pelo menos 3 caracteres");
      setIsLoading(false);
      return;
    }

    if (subdomain.length > 30) {
      setError("Subdomínio deve ter no máximo 30 caracteres");
      setIsLoading(false);
      return;
    }

    if (!subdomainPattern.test(subdomain)) {
      setError(
        "Subdomínio deve conter apenas letras, números e hífens, e não pode começar ou terminar com hífen",
      );
      setIsLoading(false);
      return;
    }

    if (reservedNames.includes(subdomain.toLowerCase())) {
      setError("Este subdomínio é reservado, escolha outro");
      setIsLoading(false);
      return;
    }
    try {
      const user = await pb.collection("users").create({
        email,
        password: "password",
        passwordConfirm: "password",
      });
      await pb.collection("stores").create({
        name,
        subdomain,
        cnpj,
        user: [user.id],
      });
      const requestOTP = await pb.collection("users").requestOTP(email);
      setOTPID(requestOTP.otpId);
      setCurrentStep("otp");
      setResendCountdown(60);
    } catch (err: any) {
      if (err.response?.data?.email?.code === "validation_not_unique") {
        setError("Email já utilizado");
        return;
      }
      if (err.response?.data?.subdomain?.code === "validation_not_unique") {
        setError("Este subdomínio já está em uso, escolha outro");
        return;
      }
      setError("Falha ao criar loja");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await pb.collection("users").authWithOTP(otpID, code);
      navigate({ to: "/admin" });
    } catch (err: any) {
      console.error({ ...err });
      setError("Código inválido");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    const requestOTP = await pb.collection("users").requestOTP(email);
    setOTPID(requestOTP.otpId);
    setResendCountdown(60);
  };

  const renderFormStep = () => (
    <form onSubmit={handleCreate} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="email@examplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">Nome do Loja</Label>
        <Input
          id="name"
          type="text"
          placeholder="Minha Loja"
          value={name}
          onChange={(e) => setName(e.target.value)}
          minLength={2}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="url">Subdomínio</Label>
        <div className="flex">
          <Input
            id="url"
            type="text"
            placeholder="minhaloja"
            value={subdomain}
            pattern="[a-z0-9]([a-z0-9\-]*[a-z0-9])?"
            maxLength={30}
            minLength={2}
            onChange={(e) => setSubdomain(e.target.value)}
            className="rounded-r-none"
            required
          />
          <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-input bg-muted text-muted-foreground text-sm">
            .catalogo.site
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cnpj">CNPJ</Label>
        <Input
          id="cnpj"
          inputMode="numeric"
          value={cnpj}
          placeholder="00.000.000/0000-00"
          pattern="[0-9]{14}"
          onChange={(e) => setCnpj(e.target.value)}
          minLength={14}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Enviando OTP..." : "Continuar"}
      </Button>
    </form>
  );

  const renderOTPStep = () => (
    <div className="space-y-4">
      <form onSubmit={handleOTP} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="otp">Código de Verificação</Label>
          <Input
            id="otp"
            type="text"
            placeholder="Digite o código"
            value={code}
            onChange={(e) => setCode(e.target.value)}
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
  );

  const getStepTitle = () => {
    switch (currentStep) {
      case "form":
        return "Criar loja";
      case "otp":
        return "Verificar conta";
      default:
        return "";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case "form":
        return "Informe os seguintes dados";
      case "otp":
        return `Enviamos um código de verificação para ${email}`;
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {getStepTitle()}
            </CardTitle>
            <CardDescription className="text-center">
              {getStepDescription()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
                {error}
              </div>
            )}

            {currentStep === "form" && renderFormStep()}
            {currentStep === "otp" && renderOTPStep()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
