import React, { useState, useRef } from "react";
import { Typography } from "@mui/material";
import { Dialog, InputSwitch } from "primereact";
import { DialogFooter } from "components/DialogFooter";
import { useTheme } from "@mui/material/styles";
import { useAuth } from "context/AuthProvider";

// services
import { AuthService } from "services";

const POLICY_URL = process.env.REACT_APP_POLICY_URL;
const TERMS_URL = process.env.REACT_APP_TERMS_URL;

function UserAgreementDialog() {
  const theme = useTheme();
  const { authenticate, unauthenticate } = useAuth();
  const [agreement, setAgreement] = useState(false);
  const [message, setMessage] = useState(false);
  const dialogContentRef = useRef(null);

  // Get client info
  const getClientInfo = async () => {
    let response;
    let data;

    try {
      response = await fetch("https://api.ipify.org/?format=json");
      data = await response.json();
    } catch (error) {
      data.ip = null;
    }

    return {
      ip: data.ip || null,
      agent: navigator.userAgent || null,
      device: navigator.userAgentData?.platform || null,
      isMobile: navigator.userAgentData?.mobile || null,
    };
  };

  // HANDLERS -----------------------------------------------------------------
  // onSubmit handler
  const handleAccept = async () => {
    const clientInfo = await getClientInfo();

    await AuthService.agree({
      ...clientInfo,
    });
    authenticate({ agreement: true });
  };

  const handleReject = async () => {
    await AuthService.logout();
    unauthenticate();
  };

  // onClick handler to scroll bottom
  const handleClick = () => {
    if (!agreement || !message) {
      if (dialogContentRef.current) {
        dialogContentRef.current.scrollTo({
          top: dialogContentRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <Dialog
      visible
      className="p-fluid"
      position="center"
      closable={false}
      resizable={false}
      style={{ width: "85vw" }}
      footer={
        <div onClick={handleClick} style={{ paddingTop: "15px" }}>
          <DialogFooter
            disabled={!agreement || !message}
            labelSubmit="Kabul et"
            labelHide="Reddet"
            onSubmit={handleAccept}
            onHide={handleReject}
          />
        </div>
      }
    >
      <div
        ref={dialogContentRef}
        style={{
          maxHeight: "75vh",
          overflowY: "auto",
          padding: "2rem",
        }}
      >
        <div className="field mb-5" style={{ textAlign: "center" }}>
          <Typography variant="h2">Kullanıcı Sözleşmesi</Typography>
        </div>

        {/* 1. Sözleşmenin Şartları ve Tarafları */}
        <div className="field mb-3 p-4">
          <Typography variant="h4" mb={1}>
            1. Sözleşmenin Şartları ve Tarafları
          </Typography>
          <Typography variant="body1" mb={1}>
            Bu Kullanıcı Sözleşmesi ("Sözleşme"), dishekime uygulamasını
            (”Site”, “Uygulama”) sağlayan Recep Demirci ("Geliştirici") ile bu
            yazılımı kullanan klinikler, doktorlar ve diğer sağlık hizmeti
            sağlayıcıları ("Kullanıcı", “Hesap Yöneticisi”) arasında
            yapılmıştır. Bu Sözleşme, Uygulamanın kullanımı sırasında geçerli
            olan şartları, tarafların karşılıklı yükümlülüklerini ve haklarını
            düzenlemektedir. Sözleşme, Uygulamanın kullanım süresi boyunca
            yürürlükte kalacaktır.
          </Typography>
          <Typography variant="body1" mb={1}>
            dishekime Uygulamasını ve sağladığı hizmetleri (“Hizmetler”)
            kullanarak, işbu Sözleşmeye,
            <a
              href={POLICY_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: "none",
                color: theme.palette.text.secondary,
              }}
            >
              Gizlilik Politikası
            </a>
            'na,
            <a
              href={TERMS_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: "none",
                color: theme.palette.text.secondary,
              }}
            >
              Hükümler ve Koşullar
            </a>
            'ımıza, yürürlükteki tüm yasa ve yönetmeliklere ve Sitede yayınlanan
            ve bildirimde bulunmaksızın güncelleyebileceğimiz diğer yasal
            bildirimlere veya koşullara veya yönergelere uymayı kabul, beyan ve
            taahhüt etmiş olursunuz.
          </Typography>
        </div>

        {/* 2. Hizmetlerin Kapsamı */}
        <div className="field mb-3 p-4">
          <Typography variant="h4" mb={1}>
            2. Hizmetlerin Kapsamı
          </Typography>
          <Typography variant="body1">
            2.1. dishekime, Kullanıcı tarafından (Kullanıcının hastalarına 6698
            sayılı KVK Kanunu gereği bilgilendirme yaptığı, hastalarının açık
            onayını aldığı ve veri işleyen olarak dishekime’ye tüm idari, teknik
            ve güvenlik önlemlerini aldığına sorumluluğun kendisinde olması
            koşulu ile) ücretin tahsili ile söz konusu aşağıda belirtilen
            Hizmetleri vereceğini taahhüt etmektedir:
          </Typography>
          <Typography variant="body1">
            2.1.1. Diş Hekimi muayenehanelerine yönelik randevu takibi (”Randevu
            Sistemi”).
          </Typography>
          <Typography variant="body1">
            2.1.2. Hasta profili yönetimi ve hasta planlama sistemi (“Hasta
            Yönetim Sistemi”).
          </Typography>
          <Typography variant="body1">
            2.1.3. Hasta ödeme planlaması ve takibi (”Hasta Ödeme Sistemi”).
          </Typography>
          <Typography variant="body1" mb={1}>
            2.1.4. Tıbbi manipülasyonların ve hasta geçmişinin ayrıntılarını
            içeren bir dental veri yönetim sistemi (“Dental Veri Sistemi”).
          </Typography>
          <Typography variant="body1" mb={1}>
            2.2. dishekime, zaman zaman Kullanıcılara ücretsiz olarak (“Ücretsiz
            Hizmetler”) ve/veya ücretli olarak (“Profesyonel Hizmetler”) çeşitli
            Hizmetler sunabilir. Ücretsiz Hizmetlerin kullanıcıları, hesap
            başına bir (1) diş hekimi ve yetmişbeş (75) hasta ile sınırlıdır.
          </Typography>
        </div>

        {/* 3. Hizmetlere Erişim ve Kullanım */}
        <div className="field mb-3 p-4">
          <Typography variant="h4" mb={1}>
            3. Hizmetlere Erişim ve Kullanım
          </Typography>
          <Typography variant="body1" mb={1}>
            3.1. Kullanıcılar, Hizmetlere erişmek ve kullanmak için bir hesap
            oluşturmalıdır.
          </Typography>
          <Typography variant="body1" mb={1}>
            3.2. Hesap oluşturma işlemi sırasında, Kullanıcı, ilgili tüzel
            kişilik adına hareket ettiğini ve bu Sözleşme'yi bağlayıcı olarak
            kabul ettiğini beyan eder. dishekime, Kullanıcının kimliğini ve
            yetkisini doğrulama hakkını saklı tutar.
          </Typography>
          <Typography variant="body1" mb={1}>
            3.3. Kullanıcılar, yazılımın işlevlerinden yararlanmak için kendi
            hesap bilgilerini kullanarak giriş yapmalıdır. Her Kullanıcı, kendi
            hesabından sorumludur ve girilen tüm bilgilerin doğruluğundan ve
            gizliliğinden kendisi tek başına sorumludur.
          </Typography>
          <Typography variant="body1" mb={1}>
            3.4. İlgili hesapların ve şifrelerin gizliliğine dair önlemleri
            Kullanıcı alacağını kabul, beyan ve taahhüt eder. Kullanıcı
            hatasından, güvenlik açığından kaynaklanan herhangi konu sınırı
            olmaksızın işbu Sözleşme kapsamında bulunan tüm hususlarda doğacak
            zarardan gayrikabili rücu Kullanıcı tek başına sorumludur.
          </Typography>
        </div>

        {/* 4. Hasta ve Yönetim Sistemi */}
        <div className="field mb-3 p-4">
          <Typography variant="h4" mb={1}>
            4. Hasta ve Yönetim Sistemi
          </Typography>
          <Typography variant="body1" mb={1}>
            4.1. Kullanıcılar, bir e-posta adresi ve şifre kullanarak Site
            üzerinden giriş yaparak Hasta Yönetim Sistemine erişebilirler.
          </Typography>
          <Typography variant="body1" mb={1}>
            4.2. Kullanıcı, diş hekimi (“Doktor”) veya diş sağlığı kliniği
            (”Klinik”) olabilir. Tek bir hesap, örneğin Klinikler, tek bir
            organizasyon veya Klinik için tüm doktorları arasında senkronize
            edilmiş veriler ile kullanabilirler.
          </Typography>
          <Typography variant="body1">
            4.3. Her Kullanıcı, Hizmetleri kullanırken hastalar sekmesine
            basarak kendi hesabındaki Hasta Yönetim ve Randevu Sistemine
            erişebilir ve aşağıdaki belirtilen işlevleri gerçekleştirebilir:
          </Typography>
          <Typography variant="body1">
            a) Hasta listesini gözden geçirmek.
          </Typography>
          <Typography variant="body1">
            b) Hastaya randevu eklemek, tüm randevuları gözden geçirmek.
          </Typography>
          <Typography variant="body1">
            c) Klinikteki tüm hastalarını aramak.
          </Typography>
          <Typography variant="body1">
            d) Hasta hakkında cinsiyet ve yaş gibi temel verilerin yanı sıra
            kimlik numarası ve adresi de dahil olmak üzere Hasta Profilindeki
            verileri düzenlemek. Ayrıca, Hasta Profiline hasta davranışına
            ilişkin değerlendirici notlar eklemek.{" "}
          </Typography>
          <Typography variant="body1">
            e) Hasta için yaklaşan tüm randevuları ve önceki tüm randevuları
            görüntülemek.
          </Typography>
          <Typography variant="body1">
            f) Hasta profillerine erişmek.
          </Typography>
          <Typography variant="body1" mb={1}>
            g) Şu anda dahil olan veya gelecekte dahil edilecek olan diğer
            işlevler.
          </Typography>
        </div>

        {/* 5. Hesap Araçları ve Yönetimi */}
        <div className="field mb-3 p-4">
          <Typography variant="h4" mb={1}>
            5. Hesap Araçları ve Yönetimi
          </Typography>
          <Typography variant="body1">
            5.1. Kullanıcılar, Hesap Ayarları bölümüne erişebilir. 5.2. Profil
            sayfasında Kullanıcı şunları yapabilir:
          </Typography>
          <Typography variant="body1">
            a) Kullanıcının Doktor/Klinik tam adını değiştirebilir.
          </Typography>
          <Typography variant="body1" mb={1}>
            b) Kullanıcının Şifresini değiştirebilir.
          </Typography>
          <Typography variant="body1">
            5.3. Abonelik ve Faturalama sayfasında Kullanıcı şunları yapabilir:{" "}
          </Typography>
          <Typography variant="body1">
            a) Aboneliğinin durumunu gözden geçirebilir.
          </Typography>
          <Typography variant="body1" mb={1}>
            b) Yeni abonelik satın alabilir.
          </Typography>
          <Typography variant="body1">
            5.4. Doktor listesi sayfasında Kullanıcı şunları yapabilir:
          </Typography>
          <Typography variant="body1">
            a) Doktorları listeleyebilir, filtreleyebilir.
          </Typography>
          <Typography variant="body1" mb={1}>
            b) Doktor ekleyebilir ve silebilir.
          </Typography>
          <Typography variant="body1" mb={1}>
            5.5. Gelecekteki güncellemeler sırasında bu işleve yeni işlevler
            eklenebilir.
          </Typography>
        </div>

        {/* 6. Dental Veri Sistemi Yönetimi */}
        <div className="field mb-3 p-4">
          <Typography variant="h4" mb={1}>
            6. Dental Veri Sistemi Yönetimi
          </Typography>
          <Typography variant="body1" mb={1}>
            6.1. Kullanıcılar, Hizmetleri kullanırken Hastalar sekmesine basarak
            Uygulamadaki Dental Veri Sistemi işlevine erişebilirler. Dental Veri
            Sistemi, hasta profili için hastanın görsel dental profilinin
            düzenlenebileceği ve manipüle edilebileceği görsel bir bileşen
            içerir.
          </Typography>
          <Typography variant="body1">
            6.2. Kullanıcılara şunlar sağlanır:{" "}
          </Typography>
          <Typography variant="body1">
            a) Tüm Hastaları gözden geçirmek.
          </Typography>
          <Typography variant="body1">
            b) Bir Hastanın profilini düzenlemek.{" "}
          </Typography>
          <Typography variant="body1">
            c) Yeni bir hasta profili eklemek.{" "}
          </Typography>
          <Typography variant="body1">
            d) Bir hasta profilinin tedavi geçmişini gözden geçirmek.{" "}
          </Typography>
          <Typography variant="body1">
            e) Bir hasta hakkındaki tüm veri girişlerinin geçmiş kaydını gözden
            geçirmek.{" "}
          </Typography>
          <Typography variant="body1">
            f) Hasta profilinin tedavi planını gözden geçirmek, düzenlemek ve
            eklemek.{" "}
          </Typography>
          <Typography variant="body1">
            g) Hasta profiline herhangi bir not eklemek.{" "}
          </Typography>
          <Typography variant="body1">
            h) Bir hastanın diş profilini görsel olarak gözden geçirmek.{" "}
          </Typography>
          <Typography variant="body1">
            i) Bir hastanın tek bir dişinin verilerini ve özelliklerini gözden
            geçirmek.
          </Typography>
          <Typography variant="body1">
            j) Bir dişin restorasyonunu takip etmek ve planlamak.{" "}
          </Typography>
          <Typography variant="body1">
            k) Tek bir diş hakkında tedaviler atamak.{" "}
          </Typography>
          <Typography variant="body1" mb={1}>
            l) Bir hasta için tedavi tutarını ve ödeme geçmişini gözden geçirmek
            ve düzenlemek.
          </Typography>
        </div>

        {/* 7. Kullanıcı Davranış Kuralları */}
        <div className="field mb-3 p-4">
          <Typography variant="h4" mb={1}>
            7. Kullanıcı Davranış Kuralları
          </Typography>
          <Typography variant="body1" mb={1}>
            7.1. Kullanıcılar, dishekime'yi yasal olmayan herhangi bir amaçla
            veya yasa dışı faaliyetlerde bulunmak için kullanmamayı kabul
            ederler. Web sitesine zarar verebilecek veya ağın güvenliğini ihlal
            edebilecek her türlü faaliyetten kaçınmalıdırlar. Sitedeki veya
            Siteye bağlı herhangi bir ağdaki güvenlik veya kimlik doğrulama
            önlemlerini ihlal etmeye çalışmamalıdır.{" "}
          </Typography>
          <Typography variant="body1" mb={1}>
            7.2. Kullanıcılar, Sitenin, dishekime sistemlerinin veya ağlarının
            altyapısına makul olmayan veya orantısız derecede büyük bir yük
            getiren herhangi bir eylemde bulunmayacaklarını kabul ederler.
          </Typography>
          <Typography variant="body1" mb={1}>
            7.3. Her Kullanıcı, Sitenin ve Hizmetlerin kullanımından, Siteye
            veya Hizmetlere girilen tüm verilerin (“Veriler”) doğruluğundan ve
            eksiksizliğinden ve bunların sonuçlarından sorumludur. Kullanıcı,
            Verileri yüklemek ve/veya paylaşmak için uygun yetkiye sahip
            olduğundan ve verinin işlenmesinden sorumlu olduğunu kabul eder.
            dishekime, kullanıcılar tarafından girilen verilerin gizliliği veya
            kamuya açık olmayan bilgilerin ifşasıyla ilgili herhangi bir
            sorumluluk kabul etmez.{" "}
          </Typography>
          <Typography variant="body1" mb={1}>
            7.4. Kullanıcı, gerçek kişilerle ilgili herhangi bir Veri girerse,
            veri sorumlusu olarak Kullanıcı, işleme için uygun yasal dayanağın
            mevcut olmasını ve ilgili olması halinde Verileri veri sahibine,
            yasalara uygun olarak sağlamaktan tek başına sorumlu ve yükümlü
            olduğunu kabul eder.{" "}
          </Typography>
          <Typography variant="body1" mb={1}>
            7.5. dishekime, Gizlilik Politikasına uygun olarak alınan gerçek
            kişilerin Verilerini kullanabilir veya Verileri anonimleştirebilir
            ve bilimsel analiz ve araştırma için daha fazla kullanabilir.
            Anonimleştirilmiş veriler, yapay zekanın tedaviler önermesi için
            değerlendirmeler olarak ve ayrıca dishekime’nin Kullanıcılarına ve
            hastalara daha iyi bir hizmet sunmak için ekonomik amaçlarla
            kullanılabilir.
          </Typography>
        </div>

        {/* 8. Ticari Elektronik İleti */}
        <div className="field mb-3 p-4">
          <Typography variant="h4" mb={1}>
            8. Ticari Elektronik İleti
          </Typography>
          <Typography variant="body1" mb={1}>
            8.1. Kullanıcı, dishekime tarafından kendisine sunulan ürün ve
            hizmetlerin hakkında genel/özel imkanların duyurulmasına, güncel
            gelişmelerden haberdar edilmesine, kutlama amaçlı iletiler
            gönderilmesine, sunum ve bülten gibi içeriklerin paylaşılmasına,
            tanıtım ve reklamının yapılması için kendisine ilgili kanunlara
            uygun olarak ticari elektronik ileti ve diğer iletiler
            gönderilmesine, iletişim bilgilerinin, kimlik bilgilerinin,
            pazarlama bilgilerinin mal / hizmet satış ve reklam / kampanya /
            promosyon süreçlerinin yürütülmesi adına bu amaçlar ile alındığına
            ve tercih ettiği kanalla tarafına iletiler gönderileceğine veya
            hiçbir gerekçe göstermeksizin tarafına gelen iletilerde belirtilen
            işlemi reddederek iletişimi durdurabileceğine ve kanunlara uygun
            şekilde SMS/kısa mesaj, otomatik arama, telefonla arama, sosyal
            medya ile çevrimiçi reklam ağları, e-posta/mail ve diğer elektronik
            iletişim kanalları yoluyla kendisine ticari elektronik iletiler ve
            diğer iletiler gönderilmesine ilişkin onay vermektedir.
          </Typography>
        </div>

        {/* 9. Çerezler ve İlgili Teknolojiler */}
        <div className="field mb-3 p-4">
          <Typography variant="h4" mb={1}>
            9. Çerezler ve İlgili Teknolojiler
          </Typography>
          <Typography variant="body1" mb={1}>
            9.1. Siteyi ve Hizmetlerimizi kullandığınızda, çerezler, piksel
            etiketleri, tarayıcı analiz araçları ve web sunucusu günlükleri gibi
            teknolojileri kullanarak otomatik veya elektronik yollarla belirli
            bilgileri toplarız. Sitemizi ve Hizmetlerimizi kullandığınızda,
            tarayıcınız ve cihazlarınız, etkileşimi koordine etmek ve kaydetmek,
            Hizmetler ve bilgi taleplerinizi karşılamak için bizim, iş
            ortaklarımız ve hizmet sağlayıcılarımız tarafından işletilen
            sunucularla iletişim kurar.
          </Typography>
          <Typography variant="body1" mb={1}>
            9.2. Çerezlerden ve ilgili teknolojilerden elde edilen bilgiler web
            sunucusu günlüklerinde ve ayrıca bilgisayarlarınızda veya mobil
            cihazlarınızda tutulan web çerezlerinde saklanır ve bunlar daha
            sonra bilgisayarınız veya mobil cihazınız tarafından Sitemize ve
            Hizmetlerimize geri iletilir. Bu sunucular işletilmekte ve çerezler
            bizim, iş ortaklarımız veya hizmet sağlayıcılarımız tarafından
            yönetilmektedir.
          </Typography>
          <Typography variant="body1" mb={1}>
            9.3. Çerezlerden ve diğer teknolojilerden, son kullanılan dil ve
            ziyaret geçmişi dahil olmak üzere birçok farklı türde bilgi
            toplarız. Çerezleri, Sitemiz, üçüncü taraf web siteleri, uygulamalar
            veya diğer iletişim yöntemleri aracılığıyla size reklam sağlamak ve
            belirli Hizmetlerin ve Sitenin işleyişini sağlamak için kullanırız.
            Çerezlerin ve ilgili teknolojilerin kullanılmasına izin vermemeniz
            halinde, sağladığınız bilgilerin (kişisel veriler de içerebilir)
            miktarına bağlı olarak size belirli Hizmetleri ve Sitenin
            işlevlerini sağlayamayabileceğimizi lütfen unutmayın.
          </Typography>
          <Typography variant="body1" mb={1}>
            9.4. Ziyaretçilerin, Sitemizle nasıl etkileşime girdiğini anlamamıza
            ve kullanıcı deneyimimizi geliştirmemize yardımcı olmak için Google
            Analytics ve diğer hizmetleri kullanıyoruz.
          </Typography>
        </div>

        {/* 10. Üçüncü Taraf Verileri */}
        <div className="field mb-3 p-4">
          <Typography variant="h4" mb={1}>
            10. Üçüncü Taraf Verileri
          </Typography>
          <Typography variant="body1" mb={1}>
            10.1. Siteyi ve Uygulamayı, örneğin hastalar gibi diğer gerçek
            kişilerin kişisel verilerinin işlenmesi için kullanabilirsiniz.
            Siteyi kullanan Kullanıcılar, üçüncü taraf kişilere ait kişisel
            verilerin işlenmesi süreçlerinde veri sorumlusu sıfatını taşır.
            Siteyi geliştiren ve bakımını yapan dishekime ise, veri sorumlusunun
            talimatları doğrultusunda kişisel verileri işleyen veri işleyen
            sıfatını taşır.
          </Typography>
          <Typography variant="body1" mb={1}>
            10.2. İşbu Kullanıcı Sözleşmesini kabul ederek, söz konusu üçüncü
            tarafların kişisel verilerinin Site ve Uygulama aracılığıyla
            işlenmesinden tamamen sorumlu ve yükümlü olduğunuzu anladığınızı
            teyit edersiniz. dishekime, Site ve Uygulama aracılığıyla
            işlediğiniz üçüncü tarafların kişisel verilerinden sorumlu ve
            yükümlü değildir.
          </Typography>
          <Typography variant="body1" mb={1}>
            10.3. Bu nedenle, Siteyi ve Uygulamayı üçüncü tarafların kişisel
            verilerini işlemek için kullanma hakkına yalnızca kişisel verilerle
            bu tür faaliyetleri yürütmek için yasal bir dayanağınız varsa ve
            geçerli yasaların gerekliliklerine uyuyorsanız sahip olduğunuzu
            anladığınızı teyit edersiniz.
          </Typography>
        </div>

        {/* 11. Veri İşleme ve Gizlilik */}
        <div className="field mb-3 p-4">
          <Typography variant="h4" mb={1}>
            11. Veri İşleme ve Gizlilik
          </Typography>
          <Typography variant="body1" mb={1}>
            11.1. Bu bölüm, dishekime tarafından sağlanan Hizmetler bağlamında
            kişisel verilerin işlenmesine ilişkin hüküm ve koşulları ortaya
            koymaktadır. Bu şartlar, bu Hizmetlerin kullanımıyla işlenen tüm
            veriler için geçerlidir. Kişisel verilerin işlenmesi amacıyla,
            Kullanıcı/Hesap sahibi veri sorumlusu olarak belirlenmiştir ve
            dishekime, Hizmetlerin kullanımı kapsamında işlenen kişisel
            verilerin işleyeni olarak veri işleyendir.
          </Typography>
          <Typography variant="body1" mb={1}>
            11.2. dishekime yalnızca Uygulamaya ilişkin altyapı ve hizmeti
            sağlamaktadır. Uygulamada oluşturulan ve paylaşılan bilgi ve
            belgelere ilişkin herhangi bir sorumluluğu bulunmamaktadır.
            Kullanıcı/Hesap sahibi, Uygulamada oluşturulan belgelerin veya
            yüklenen bilgi ve içeriklerin doğru ve hukuka uygun olduğunu,
            Uygulama dahilinde barındırdığı tüm bilgi ve dokümanlardan, e-posta,
            sms hizmetleri ile kullanacağı ve faydalanacağı tüm işlemlerden
            kendisi sorumlu olduğunu, söz konusu veri, bilgi ve beyanların
            herhangi bir hak ihlaline sebep olmayacağını kabul ve taahhüt
            etmektedir. Uygulamada oluşturulan ve paylaşılan içeriklerin ve
            bunlarla ilgili diğer süreçlerin Sosyal Güvenlik Hukuku ve İş Hukuku
            başta olmak üzere ilgili mevzuata uygun olmasının sağlanması
            münhasıran Kullanıcıya aittir. Uygulamanın işbu Sözleşme ve ilgili
            mevzuata uygun olmayan şekilde kullanımı nedeniyle, Kullanıcının
            Uygulamadan faydalanma imkanı kısmen veya tamamen askıya
            alınabilinecek olup, bu konuda doğabilecek uyuşmazlıklardan dolayı
            dishekime herhangi bir sorumluluk kabul etmez.
          </Typography>
          <Typography variant="body1" mb={1}>
            11.3. dishekime diş kliniklerinin ve diş hekimlerinin günlük
            işlerine ilişkin altyapı hizmeti sunmaktadır. 6563 sayılı Elektronik
            Ticaretin Düzenlenmesi Hakkında Kanun’un md. 8/2 “Hizmet sağlayıcı
            ret bildiriminin, elektronik iletişim araçlarıyla kolay ve ücretsiz
            olarak iletilmesini sağlamakla ve gönderdiği iletide buna ilişkin
            gerekli bilgileri sunmakla yükümlüdür.’’ ve Ticari İletişim ve
            Ticari Elektronik İletiler Hakkında Yönetmeliğin 9/3 maddesindeki
            “Hizmet sağlayıcının alıcının ret bildirimi için ticari elektronik
            iletide müşteri hizmetleri numarası kısa mesaj numarası veya
            yalnızca ret bildirimine özgülenmiş bir URL adresi gibi erişilebilir
            iletişim adresini vermesi gerekir. Ticari elektronik ileti hangi
            iletişim kanalı ile gönderildiyse ret bildirimi de kolay ve ücretsiz
            bir şekilde olmak üzere aynı iletişim kanalı ile sağlanır.”
            düzenlemesi nedeniyle içeriğik sorumluluğu tarafımızda olmayan
            ticari iletileri mevzuat çerçevesinde göndermek Kullanıcının
            sorumluluğundadır. Kullanıcı tarafından işbu sorumluluğa aykırı
            hareket edilmesi halinde dishekime’nin karşı karşıya kalacağı cezai
            ve hukuki yükümlülükler Kullanıcıya rücu edilecektir. Kullanıcı işbu
            hükmü koşulsuz şartsız kabul ve beyan eder.
          </Typography>
          <Typography variant="body1" mb={1}>
            11.4. Kullanıcı, Hizmetlere Kullanıcı tarafında kişisel verileri
            yüklenecek hesaplar bakımından 6698 sayılı Kişisel Verilerin
            Korunması Kanunu kapsamında veri sorumlusu sıfatına haiz olduğunu,
            kişisel verilerin Hizmetlere yüklenmesi ve veri işleyen sıfatını
            haiz dishekime tarafından bu verilerin işlenmesi de dahil olmak
            üzere bu kapsamda Kullanıcı tarafında Hizmetlere kayıt edilmiş
            hesaplardan gerekli onayların alınması, gerekli bilgilendirilmelerin
            yapılması ve ilgili mevzuat kapsamındaki yükümlülüklerin yerine
            getirilmesinin münhasıran kendi sorumluluğunda olduğunu, bu kapsamda
            dishekime’nin maruz kalabileceği her türlü talep ve zararın
            kendisine rücu edileceğini beyan, kabul ve taahhüt eder.
          </Typography>
          <Typography variant="body1" mb={1}>
            11.5. Kullanıcı, dishekime'nin Hizmetleri kapsamında Kullanıcı veya
            Kullanıcı tarafında Uygulamaya kayıt edilmiş hesaplar tarafından
            paylaşılan bilgi, belge ve fotoğrafları kullanarak, söz konusu bilgi
            ve belgeler içindeki kişisel verileri anonimleştirmek suretiyle ve
            hesapların kimliğini ifşa etmeden istatistiki değerlendirmeler
            yapabileceğini, yapay zekanın tedavi önermesi için çalışmalarında
            kullanılabileceğini kabul eder.
          </Typography>
          <Typography variant="body1" mb={1}>
            11.6. dishekime, Kullanıcının bilgilerini yasal bir zorunluluk
            olarak istendiğinde, yasal gereklere uygun hareket etmek ve
            dishekime’ye tebliğ edilen yasal işlemlere uymak ve Uygulama ve
            dishekime'nin haklarını ve mülkiyetini korumak ve savunmak için
            gerekli olduğuna iyi niyetle kanaat getirdiği hallerde
            açıklayabilir.
          </Typography>
          <Typography variant="body1" mb={1}>
            11.7. dishekime, Uygulamada değişiklikler yapma, Uygulamanın yeni
            sürüm, yayın, genişletilmiş biçimlerini vb. çıkarma, Uygulamaya yeni
            özellikler ekleme veya mevcut özelliklerini kaldırma hakkına
            sahiptir.
          </Typography>
          <Typography variant="body1" mb={1}>
            11.8. dishekime Uygulamaya Kullanıcı tarafından kaydedilmiş
            bilgileri Kullanıcı’nın bilgisi olmaksızın hiçbir kurum, kuruluş ve
            3. şahıs ile yasal zorunluluklar dışında paylaşmayacağını beyan,
            kabul ve taahhüt eder.
          </Typography>
          <Typography variant="body1" mb={1}>
            11.9. dishekime Uygulamaya Kullanıcı tarafından kayıt edilmiş
            bilgileri Kullanıcının kendi bilgisayarına aktarabileceği bir alt
            yapıyı her zaman hazır bulunduracağını beyan, kabul ve taahhüt eder.
          </Typography>
          <Typography variant="body1" mb={1}>
            11.10. dishekime sağladığı Hizmetler içerisinde bulunan Kullanıcı
            verilerinin hatalı kullanımlarından, veri içeriklerinden, e-posta,
            sms ile kullanılan tüm verilerden doğabilecek hiçbir maddi veya
            manevi zarardan sorumlu tutulamaz. Bu verilerin yedekleme ve saklama
            sorumlulukları dishekime’ye aittir. dishekime Kullanıcının tüm
            verilerini düzenli bir biçimde yedekleme ve bakım ve talep halinde
            silme, imha etme, anonimleştirme yahut yasal olarak yok etme
            işlemine tabi tutacağını taahhüt eder. Buna rağmen doğal afetler,
            kamu yaptırımlarından veya üçüncü taraf servis sağlayıcılarından
            dolayı Hizmetlerde meydana gelebilecek kesinti veya veri kaybından
            dolayı oluşabilecek hasarlardan ve zarardan dishekime sorumlu
            değildir.
          </Typography>
          <Typography variant="body1" mb={1}>
            11.11. dishekime, sunduğu Hizmetleri abonelik süresi bitiminden
            sonra durdurma veya Hizmetleri tamamen iptal etme hakkını saklı
            tutmaktadır. Süresi dolmuş veya ödemesi sağlanmamış Hizmetlerin
            iptalinden sonra dishekime’nin herhangi bir veri kaydı tutma
            yükümlülüğü bulunmamaktadır.
          </Typography>
        </div>

        {/* 12. Sorumluluğun Reddi ve Sınırlandırılması */}
        <div className="field mb-3 p-4">
          <Typography variant="h4" mb={1}>
            12. Sorumluluğun Reddi ve Sınırlandırılması
          </Typography>
          <Typography variant="body1" mb={1}>
            12.1. dishekime, "olduğu gibi" ve "mevcut olduğu şekilde"
            sağlanmaktadır. dishekime, Sitenin belirli bir amaca uygunluğu,
            kesintisiz erişim, güvenlik, hata ve virüslerden arınmış olması gibi
            hususlarda herhangi bir garanti vermez. Sitenin üçüncü taraf hizmet
            sağlayıcılar nedeniyle kesintiye uğramasından dishekime hiçbir
            sorumluluk kabul etmez.
          </Typography>
          <Typography variant="body1" mb={1}>
            12.2. dishekime, bilgisayar virüslerinin ve diğer aksaklıkların
            neden olduğu zararları önlemek ve Sitenin sürekli olarak sunulmasını
            ve kalitesini sağlamak için teknolojik araçlar kullanır. dishekime
            veya tedarikçileri, Sitenin kullanımı veya kullanılamamasından
            kaynaklanan herhangi bir zarardan (veri kaybı veya kar kaybı veya iş
            kesintisi, bilgisayar arızası nedeniyle oluşan zararlar dahil ancak
            bunlarla sınırlı olmamak üzere) hiçbir durumda sorumlulu kabul
            etmez.
          </Typography>
          <Typography variant="body1" mb={1}>
            12.3. Siteyi kullanmanız nedeniyle veya bununla bağlantılı olarak
            herhangi bir üçüncü tarafça dishekime’ye karşı yapılan her türlü
            talep, kayıp, yükümlülük, iddia veya masraftan (avukatlık ücretleri
            dahil) dishekime’yi, yetkililerini, yöneticilerini, hissedarlarını,
            çalışanlarını, acentelerini, iştiraklerini ve bağlı kuruluşlarını
            tazmin etmeyi ve bunlardan zarar görmemesini sağlamayı kabul
            edersiniz.
          </Typography>
        </div>

        {/* 13. Sözleşmenin Süresi */}
        <div className="field mb-3 p-4">
          <Typography variant="h4" mb={1}>
            13. Sözleşmenin Süresi
          </Typography>
          <Typography variant="body1" mb={1}>
            13.1. İşbu Sözleşme sipariş ve ödeme işlemlerinin internet
            ortamından veya birebir satış sırasında dishekime’ye iletilmesi ile
            tarafların belirtilen hak ve yükümlülükleri başlar.
          </Typography>
          <Typography variant="body1" mb={1}>
            13.2. Kullanıcı tarafından periyod bitiminden 10 (on) gün öncesine
            kadar aksi talep edilmediği sürece her periyodun bitiminde işbu
            Sözleşme otomatik olarak yenilenecektir.
          </Typography>
        </div>

        {/* 14. Mali Hükümler */}
        <div className="field mb-3 p-4">
          <Typography variant="h4" mb={1}>
            14. Mali Hükümler
          </Typography>
          <Typography variant="body1" mb={1}>
            14.1. İşbu Sözleşmede belirtilen hizmetler karşılığı olarak ödenecek
            ücret Site’de beyan edilen miktar kadardır ve yine Site’de beyan
            edilen ödeme koşulları ve araçları ile tam ve eksiksiz olarak
            gerçekleştirilir.
          </Typography>
          <Typography variant="body1" mb={1}>
            14.2. Uygulama’ya ilişkin ücretler, ödeme koşulları, ücretlerin
            yürürlük tarihleri Site’nin ilgili bölümlerinde ilan edilecektir.
            Kullanıcı, kendi isteğine bağlı olarak üyelik paketini
            yükseltebilecek veya düşürebilecektir. Buna ilişkin talepler,
            dishekime tarafından aksi öngörülmedikçe ilgili üyelik döneminin
            sonunda gerçekleştirilecektir. Kullanıcı’nın üyelik süresi boyunca
            üyelik paketine ilişkin ücret ve ödeme koşullarında yapılacak
            değişiklikler, Kullanıcı’nın üyelik döneminin sona ermesine dek
            uygulanmayacak, yeni ücretler ve ödeme koşulları yeni üyelik
            döneminin başlamasıyla geçerli olacaktır. Üyelik dönemi boyunca
            Sözleşme’nin feshi de dahil olmak üzere üyeliğin herhangi bir
            nedenle sona ermesi halinde geri ödeme yapılmayacaktır.
          </Typography>
          <Typography variant="body1" mb={1}>
            14.3. Kullanıcı tarafından periyod bitiminden 10 (on) gün öncesine
            kadar aksi talep edilmediği sürece her periyodun bitiminde
            Kullanıcı’nın üyeliği otomatik olarak yenilenecektir.
          </Typography>
          <Typography variant="body1" mb={1}>
            14.4. Tüm faturalar, sonradan ödemeli üyelik halinde bir önceki
            üyelik dönemine ilişkin ücretleri, ön ödemeli üyeliklerde ise bir
            sonraki üyelik dönemine ilişkin ücretleri içerecektir. Kullanıcı,
            faturadaki ilgili tutarı fatura tarihini takip eden 7 (yedi) iş günü
            içinde ödeyecektir. İlgili ücretlere ilişkin vergi ve harçların
            ödenmesinden Kullanıcı sorumludur.
          </Typography>
          <Typography variant="body1" mb={1}>
            14.5. dishekime, sözleşme tarihinden sonra yürürlüğe giren kamu
            yaptırımlarıyla ürünün kullanımına ilişkin ortaya çıkan ekstra
            maliyetleri Kullanıcılara yansıtma hakkını saklı tutar.
          </Typography>
          <Typography variant="body1" mb={1}>
            14.6. dishekime, Kullanıcı ödeme işlemini tamamlayıncaya kadar
            ilgili hizmeti kapatma, askıya alma ve kapalı tutma hakkını saklı
            tutar. Bu nedenle oluşabilecek zarar ve kayıplardan dishekime
            sorumlu tutulamaz.
          </Typography>
          <Typography variant="body1" mb={1}>
            14.7. Kullanıcı, dishekime veya dishekime tarafından onaylanmış
            üçüncü kişiler üyeliğe ve ödemeye ilişkin işlemler veya banka
            entegrasyonunu ve ilgili güncellemeleri gerçekleştirmek için
            Kullanıcı’nın kredi kartı ve ödeme bilgilerini saklayabilecektir.
          </Typography>
        </div>

        {/* 15. Hesabın Askıya Alınması ve Sözleşmenin Feshi */}
        <div className="field mb-3 p-4">
          <Typography variant="h4" mb={1}>
            15. Hesabın Askıya Alınması ve Sözleşmenin Feshi
          </Typography>
          <Typography variant="body1" mb={1}>
            15.1. Kullanıcının işbu Sözleşmede belirtildiği şekilde ödeme
            yapmaması, geciktirmesi yahut işbu Sözleşmede belirtilen
            yükümlülüklere uymaması durumunda, dishekime Kullanıcıya verilen
            hizmetlerin tümünü durdurma, askıya alma, hesap erişimini
            sınırlandırma ve hesabı silme hakkını saklı tutar.
          </Typography>
          <Typography variant="body1" mb={1}>
            15.2. Kullanıcı, dishekime tarafından askıya alınan hesap erişiminde
            e-posta, sms, web erişimleri yapamaz ve Kullanıcının e-posta, sms
            hesapları dondurulur. Kullanıcı, sorumluluğun kendisinde olduğunu
            beyan, kabul ve taahhüt eder.
          </Typography>
          <Typography variant="body1" mb={1}>
            15.3. Kullanıcı, işbu Sözleşmenin herhangi bir maddesine aykırı
            davranarak sorumluluklarını ve taahhütlerini yerine getirmediği
            takdirde ya da işbu Sözleşmede beyan ettiği bilgilerinin doğru
            olmadığının tespiti halinde, yukarıda belirtilen sözleşmeyi askıya
            alma halinin 7 (yedi) iş gününden fazla devam etmesi halinde,
            dishekime hiç bir ihtar ve ihbara gerek kalmaksızın sözleşmeyi tek
            taraflı olarak fesih etme hakkına sahiptir.
          </Typography>
          <Typography variant="body1" mb={1}>
            15.4. Kullanıcı, aldığı hizmetlere karşılık fatura tarihini takip
            eden 7 (yedi) iş günü içinde ödeme gerçekleştirmediği takdirde
            temerrüde düşmüş sayılır.
          </Typography>
          <Typography variant="body1" mb={1}>
            15.5. Kullanıcı, işbu Sözleşmeden doğan her türlü alacak için
            dishekime’nin Kullanıcı aleyhine dava açması ya da icra takibi
            yapması halinde bakiye borç miktarının %50'si kadar cezai şart,
            %20'si Avukatlık Ücreti ve diğer tüm yasal giderleri ödemeyi beyan,
            kabul ve taahhüt eder.​
          </Typography>
          <Typography variant="body1" mb={1}>
            15.6. (15.3.) maddesinde gerçekleşecek fesih sonrasında Kullanıcı;
            kalan süreye bakılmaksızın ödemiş olduğu son sözleşme ücretini geri
            isteyemeyeceğini, kabul ve taahhüt eder.
          </Typography>
          <Typography variant="body1" mb={1}>
            15.7. Taraflardan herhangi biri, diğer tarafça bildirilen e-posta
            adresine 10 (on) gün önceden yapacağı yazılı bir bildirimle işbu
            Sözleşme’yi dilediği zaman herhangi bir gerekçe göstermeksizin ve
            tazminat ödemeksizin feshedebilecektir. Bu bildirim, e-posta yoluyla
            yapılabileceği gibi noter kanalıyla da gerçekleştirilebilir.
          </Typography>
          <Typography variant="body1" mb={1}>
            15.8. İşbu Sözleşmenin sona erme süresinden önce Kullanıcının
            sözleşmeyi feshetmesi ya da sözleşmenin taraflarca iptali halinde,
            Kullanıcı ürüne ödemiş olduğu lisans ücretini talep etmeyeceğini
            kabul eder.
          </Typography>
          <Typography variant="body1" mb={1}>
            15.9. Kullanıcı hesabının yasal nedenlerle engellenmiş olmadığı ve
            Sözleşme’nin feshedildiği hallerde Şirket İçerik’e 3 (üç) ay boyunca
            salt okunur erişim sağlayacaktır.
          </Typography>
          <Typography variant="body1" mb={1}>
            15.10. dishekime, işbu Sözleşme yürürlükte olduğu müddetçe Veriyi
            saklama hakkına sahiptir. Kullanıcı’nın üyelik döneminin veya işbu
            Sözleşme’nin sona ermesini takip eden 3 (üç) ay içinde Kullanıcı
            Verilerini ücret ödemeksizin alabilecektir. dishekime, bu sürenin
            sona ermesinden sonra iletilen söz konusu talepler için ücret talep
            edebilecektir. İlgili ücretler Uygulama kapsamında belirtilecektir.
          </Typography>
        </div>

        {/* 16. Diğer Hükümler */}
        <div className="field mb-3 p-4">
          <Typography variant="h4" mb={1}>
            16. Diğer Hükümler
          </Typography>
          <Typography variant="body1" mb={1}>
            16.1. Mücbir sebep sayılan tüm durumlarda, dishekime işbu Sözleşme
            ile belirlenen edimlerinden herhangi birini geç veya eksik ifa etme
            veya ifa etmeme nedeniyle sorumlu tutulamaz. Mücbir sebep; doğal
            afet, isyan, savaş, grev, lokavt, telekomünikasyon altyapısından
            kaynaklanan arızalar, elektrik kesintisi ve kötü hava koşulları da
            dâhil ve fakat bunlarla sınırlı olmamak kaydıyla ilgili tarafın
            makul kontrolü haricinde gerçekleşen olaylar ve küresel ya da
            ülkesel çapta pandemi ilanı gibi taraflarca öngörülemeyecek olaylar
            olarak yorumlanacaktır. Mücbir sebep süresince tarafların edimleri
            askıya alınacaktır
          </Typography>
        </div>

        {/* 17. Yetkili Mahkeme ve İcra Daireleri */}
        <div className="field mb-3 p-4">
          <Typography variant="h4" mb={1}>
            17. Yetkili Mahkeme ve İcra Daireleri
          </Typography>
          <Typography variant="body1" mb={1}>
            17.1. İşbu Sözleşme uyarınca dishekime ile Kullanıcı arasında
            yapılacak her türlü yazışma, işbu Sözleşmeden doğabilecek
            ihtilaflarda resmi kayıtlar, elektronik bilgiler, bilgisayar
            kayıtları ve her türlü taraflarca kanıtlanabilen yazışmalar,
            görseller bağlayıcı, kesin ve münhasır delil teşkil edeceğini HMK
            md. 193 anlamında delil sözleşmesi niteliğindedir. Bu sözleşmede
            hüküm altına alınmayan hususlarda Türk Borçlar Kanunu, Türk Ticaret
            Kanunu ve İcra İflas Kanunundaki hükümlerle, Türk Hukuk Sistemindeki
            genel hükümler uygulanır. Bu sözleşmenin uygulanmasında ortaya
            çıkabilecek ihtilaflarda ise, İstanbul Mahkemeleri ve İstanbul icra
            daireleri yetkilidir.
          </Typography>
        </div>

        {/* 18. Değişiklikler */}
        <div className="field mb-3 p-4">
          <Typography variant="h4" mb={1}>
            18. Değişiklikler
          </Typography>
          <Typography variant="body1" mb={1}>
            18.1. dishekime, işbu Sözleşmeyi önceden haber vermeksizin herhangi
            bir zamanda değiştirme hakkını saklı tutar. Siteyi kullanmaya devam
            ederek, işbu Sözleşmenin mevcut versiyonuna tabi olmayı kabul etmiş
            olursunuz.
          </Typography>
          <Typography variant="body1" mb={1}>
            18.2. İş bu Sözleşme, 19 (ondokuz) maddeden oluşmakta olup{" "}
            <a
              href="https://app.disheki.me"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: "none",
                color: theme.palette.text.secondary,
              }}
            >
              app.disheki.me
            </a>{" "}
            veya{" "}
            <a
              href="https://www.disheki.me"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: "none",
                color: theme.palette.text.secondary,
              }}
            >
              www.disheki.me
            </a>{" "}
            internet sitesinde işbu Sözleşmenin Kullanıcı tarafından onaylanması
            ile karşılıklı olarak yürürlüğe girmiştir.
          </Typography>
        </div>

        {/* 19. Destek ve Geri Bildirim */}
        <div className="field mb-3 p-4">
          <Typography variant="h4" mb={1}>
            19. Destek ve Geri Bildirim
          </Typography>
          <Typography variant="body1" mb={1}>
            19.1. dishekime, kullanıcı geri bildirimlerini memnuniyetle
            karşılar. Geri bildirimlerinizi dishekime@gmail.com üzerinden
            iletebilirsiniz. Bu geri bildirimlerin gizli olmadığını ve bunların
            ticari veya ticari olmayan amaçlarla kullanılabileceğini kabul etmiş
            olursunuz.
          </Typography>
        </div>

        {/* İletişim */}
        <div className="field mb-3 p-4">
          <Typography variant="h4" mb={1}>
            İletişim
          </Typography>
          <Typography variant="body1">
            Bu Kullanıcı Sözleşmesi hakkında sorularınız varsa, bizimle şu
            adresten iletişime geçebilirsiniz:
          </Typography>
          <Typography variant="body1">
            Telefon:{" "}
            <a
              href="tel:+905317006147"
              style={{
                textDecoration: "none",
                color: theme.palette.text.secondary,
              }}
            >
              +90 531 700 61 47
            </a>
          </Typography>
          <Typography variant="body1">
            E-posta:{" "}
            <a
              href="mailto: dishekime@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: "none",
                color: theme.palette.text.secondary,
              }}
            >
              dishekime@gmail.com
            </a>
          </Typography>
        </div>

        <div className="flex grid align-items-center  justify-content-end mb-1">
          <label
            htmlFor="aggreement"
            className="col-6 md:col-9 mr-2 text-right"
          >
            <a
              href={POLICY_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: "none",
                color: theme.palette.text.secondary,
              }}
            >
              Gizlilik Politikası(KVKK)
            </a>
            ve Kullanıcı Sözleşmesi metinlerini okudum, anladım ve kabul
            ediyorum.
          </label>
          <InputSwitch
            checked={agreement}
            onChange={(e) => setAgreement(e.value)}
          />
        </div>
        <div className="flex grid align-items-center  justify-content-end mb-1">
          <label htmlFor="message" className="col-3 md:6 mr-2 text-right">
            Elektronik İleti gönderilmesini onaylıyorum. <br />
          </label>
          <InputSwitch
            checked={message}
            onChange={(e) => setMessage(e.value)}
          />
        </div>
      </div>
    </Dialog>
  );
}

export default UserAgreementDialog;
