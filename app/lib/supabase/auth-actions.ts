"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

/**
 * Gửi lại liên kết xác nhận (hoặc mã OTP qua email) cho người dùng.
 * Dùng khi liên kết xác nhận trước đó đã hết hạn / không hợp lệ.
 *
 * Sau khi gửi xong, redirect về trang login trên Vercel với thông báo thành
 * công hoặc lỗi, trang login sẽ hiển thị kết quả cho người dùng.
 */
export async function resendConfirmation(formData: FormData) {
  const email = (formData.get("email") as string | null)?.toString().trim();

  if (!email) {
    redirect(
      "/login?error=missing_email&error_description=" +
        encodeURIComponent("Vui lòng nhập địa chỉ email.")
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: "https://todoapp-nine-rho.vercel.app/login",
    },
  });

  if (error) {
    redirect(
      "/login?error=resend_failed&error_description=" +
        encodeURIComponent(error.message || "Không thể gửi lại liên kết xác nhận.")
    );
  }

  redirect("/login?resent=1");
}
