import { resendConfirmation } from "@/app/lib/supabase/auth-actions";
import { MailIcon } from "@/components/icons";

/**
 * Form gửi lại liên kết xác nhận. Dùng chung cho trang chủ (lỗi xác thực)
 * và trang đăng nhập. Server action được truyền trực tiếp vào `action`.
 */
export default function ResendForm() {
  return (
    <form action={resendConfirmation} className="w-full">
      <label htmlFor="resend-email" className="mb-1.5 block text-left text-sm font-medium">
        Email
      </label>
      <div className="relative">
        <span
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: "var(--faint)" }}
        >
          <MailIcon />
        </span>
        <input
          id="resend-email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          className="text-input"
          style={{ paddingLeft: "2.5rem" }}
        />
      </div>
      <button
        type="submit"
        className="btn-primary mt-3 w-full"
        style={{ padding: "0.7rem 1rem" }}
      >
        Resend confirmation link
      </button>
    </form>
  );
}