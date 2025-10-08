package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		users, err := app.FindCollectionByNameOrId("users")
		if err != nil {
			return err
		}

		users.AuthAlert.EmailTemplate.Subject = "Login de uma nova localização"
		users.AuthAlert.EmailTemplate.Body = `<p>Olá,</p>
<p>Detectamos um login em sua conta do {APP_NAME} de uma nova localização.</p>
<p>Se foi você, pode ignorar este email.</p>
<p><strong>Se não foi você, você deve alterar imediatamente sua senha da conta {APP_NAME} para revogar o acesso de todas as outras localizações.</strong></p>
<p>
  Obrigado,<br/>
  Equipe {APP_NAME}
</p>`

		users.ConfirmEmailChangeTemplate.Subject = "Confirme seu novo endereço de email do {APP_NAME}"
		users.ConfirmEmailChangeTemplate.Body = `<p>Olá,</p>
<p>Clique no botão abaixo para confirmar seu novo endereço de email.</p>
<p>
  <a class="btn" href="{APP_URL}/_/#/auth/confirm-email-change/{TOKEN}" target="_blank" rel="noopener">Confirmar novo email</a>
</p>
<p><i>Se você não solicitou a alteração do seu endereço de email, pode ignorar este email.</i></p>
<p>
  Obrigado,<br/>
  Equipe {APP_NAME}
</p>`

		users.OTP.EmailTemplate.Subject = "OTP para {APP_NAME}"
		users.OTP.EmailTemplate.Body = `<p>Olá,</p>
<p>Sua senha de uso único é: <strong>{OTP}</strong></p>
<p><i>Se você não solicitou a senha de uso único, pode ignorar este email.</i></p>
<p>
  Obrigado,<br/>
  Equipe {APP_NAME}
</p>`

		users.ResetPasswordTemplate.Subject = "Redefina sua senha do {APP_NAME}"
		users.ResetPasswordTemplate.Body = `<p>Olá,</p>
<p>Clique no botão abaixo para redefinir sua senha.</p>
<p>
  <a class="btn" href="{APP_URL}/_/#/auth/confirm-password-reset/{TOKEN}" target="_blank" rel="noopener">Redefinir senha</a>
</p>
<p><i>Se você não solicitou a redefinição de senha, pode ignorar este email.</i></p>
<p>
  Obrigado,<br/>
  Equipe {APP_NAME}
</p>`

		users.VerificationTemplate.Subject = "Verifique seu email do {APP_NAME}"
		users.VerificationTemplate.Body = `<p>Olá,</p>
<p>Obrigado por se juntar a nós no {APP_NAME}.</p>
<p>Clique no botão abaixo para verificar seu endereço de email.</p>
<p>
  <a class="btn" href="{APP_URL}/_/#/auth/confirm-verification/{TOKEN}" target="_blank" rel="noopener">Verificar</a>
</p>
<p>
  Obrigado,<br/>
  Equipe {APP_NAME}
</p>`

		return app.Save(users)
	}, func(app core.App) error {
		return nil
	})
}
