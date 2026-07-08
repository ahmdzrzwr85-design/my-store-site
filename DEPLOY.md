نشر مشروع A.H Store (خطوات مفصّلة)

الخطة: رفع الكود إلى GitHub ثم نشر التطبيق على Render (خدمة استضافة Node.js سهلة ومجانية للتجارب).

1. تجهّز محلياً

- افتح الطرفية في المجلد `c:\askan`

2. أنشئ ملف `.gitignore` (موجود بالفعل) لتجنّب رفع `node_modules` و`orders.json` وملفات حسّاسة.

3. ارفع المشروع إلى GitHub

- أنشئ مستودعاً جديداً على GitHub (سري/عام حسب رغبتك).
- ثم شغّل الأوامر التالية محلياً في `c:\askan` (استبدل الرابط برابط الريبو الخاص بك):

```powershell
git init
git add .
git commit -m "Initial commit - A.H store"
git branch -M main
git remote add origin https://github.com/YOURNAME/YOURREPO.git
git push -u origin main
```

4. نشر على Render

- سجّل في https://render.com
- اختر "New Web Service" → Web Service
- اربط حساب GitHub واختر المستودع الذي أنشأته
- إعدادات الخدمة:
  - Environment: `Node`
  - Build Command: `npm install`
  - Start Command: `npm start`
  - Root Directory: اضبط إلى `/` إذا المشروع في جذر الريبو
- اضغط "Create Web Service" وستبدأ عملية النشر. بعد اكتمالها ستعطيك Render رابطًا عامًا للموقع.

5. إعداد متغيرات البيئة (إن وجدت)

- إذا أردت ربط مفاتيح دفع حقيقية لاحقاً (مثل Stripe)، أضفها في Render → Environment → Environment Variables.

6. تحقق من عمل الموقع

- افتح الرابط الذي وفّره Render، افتح `ab.html` (مثلاً `https://your-service.onrender.com/ab.html`) وتحقق من أن الواجهة تعمل وطلب التخزين يعمل (orders.json سيحفظ على الخادم).

ملاحظات أمان وتشغيلية

- `orders.json` محفوظ على سيرفر Render ضمن ملف النظام — إذا أردت قاعدة بيانات حقيقية استخدم PostgreSQL أو MongoDB.
- قبل قبول مدفوعات حقيقية استخدم مزوّد دفع موثوق (Stripe) واتبِع متطلبات PCI.

بدائل سريعة

- Railway.app أو Fly.io توفر تجربة نشر مشابهة.
- إن أردت أن أقوم بالخطوات نيابةً عنك (تهيئة git محلي ودفع وبدء إعداد Render)، أحتاج رابط المستودع على GitHub أو صلاحية OAuth لربط الحساب — يمكنك تنفيذ الأوامر أعلاه بنفسك إن فضّلت ذلك.
