```javascript
// Đây là mã nguồn Backend (chạy trên Server, không chạy trên trình duyệt)
// Trình duyệt của người dùng sẽ KHÔNG THỂ nhìn thấy đoạn code này.

export default {
    async fetch(request) {
        // Cấp quyền CORS để Web của bạn có thể gọi được API này
        const corsHeaders = {
            "Access-Control-Allow-Origin": "*", // Thay "*" bằng tên miền web của bạn để bảo mật hơn
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        };

        if (request.method === "OPTIONS") {
            return new Response(null, { headers: corsHeaders });
        }

        try {
            // Lấy UID từ Web gửi lên (Ví dụ: api.com/?uid=1000123456)
            const url = new URL(request.url);
            const uid = url.searchParams.get("uid");

            if (!uid) {
                return new Response(JSON.stringify({ status: "ERROR", message: "Missing UID" }), { 
                    status: 400, 
                    headers: corsHeaders 
                });
            }

            // BACKEND BÍ MẬT GỌI FACEBOOK
            const fbResponse = await fetch(`https://graph2.facebook.com/v3.3/${uid}/picture?redirect=0`);
            const data = await fbResponse.json();

            // Phân tích kết quả và CHỈ TRẢ VỀ CHỮ LIVE/DIE cho Web
            let finalStatus = "ERROR";
            if (data.data) {
                finalStatus = "LIVE";
            } else if (data.error) {
                finalStatus = "DIE";
            }

            // Trả kết quả về cho Web
            return new Response(JSON.stringify({ status: finalStatus, uid: uid }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" }
            });

        } catch (error) {
            return new Response(JSON.stringify({ status: "ERROR" }), { headers: corsHeaders });
        }
    }
}

```
