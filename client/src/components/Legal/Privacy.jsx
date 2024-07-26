import React from "react";
import { Grid, Typography } from "@mui/material";

// assets
import { ReactComponent as Logo } from "assets/svg/dishekime/dishekime.svg";

function PrivacyPolicy() {
  return (
    <Grid container justifyContent="center" style={{ padding: "2rem" }}>
      <Grid item xs={12} md={8}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          {" "}
          <Logo style={{ width: "200px" }} />
        </div>{" "}
        <Typography variant="h3" gutterBottom>
          Gizlilik Politikası
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Güncelleme Tarihi: 26 Temmuz 2024</strong>
        </Typography>
        <Typography variant="body1" paragraph>
          disheki.me web sitemize hoş geldiniz. Kişisel bilgilerinizi korumayı
          ve gizliliğinize olan saygımızı taahhüt ediyoruz. Gizlilik politikamız
          veya kişisel bilgilerinizle ilgili uygulamalarımız hakkında herhangi
          bir sorunuz veya endişeniz varsa, lütfen{" "}
          <a href="mailto:dishekime@gmail.com">dishekime@gmail.com</a> üzerinden
          bizimle iletişime geçin.
        </Typography>
        <Typography variant="body1" paragraph>
          Web sitemizi disheki.me ziyaret ettiğinizde ve hizmetlerimizi
          kullandığınızda, kişisel bilgilerinize güveniyorsunuz. Gizliliğinizi
          çok ciddiye alıyoruz. Bu gizlilik politikasında, hangi bilgileri
          topladığımızı, nasıl kullandığımızı ve bu bilgilere ilişkin
          haklarınızı mümkün olduğunca açık bir şekilde açıklamayı amaçlıyoruz.
        </Typography>
        <Typography variant="h4" gutterBottom>
          Topladığımız Bilgiler
        </Typography>
        <Typography variant="body1" paragraph>
          Sitemizde kayıt yaptırdığınızda, bizden bilgi talep ettiğinizde, ürün
          ve hizmetlerimiz hakkında bilgi almak istediğinizde, web sitemizde
          etkinliklere katıldığınızda veya başka bir şekilde bizimle iletişime
          geçtiğinizde gönüllü olarak sağladığınız kişisel bilgileri toplarız.
        </Typography>
        <Typography variant="body1" paragraph>
          Topladığımız kişisel bilgiler, bizimle ve web sitemizle olan
          etkileşimlerinizin bağlamına, yaptığınız tercihlere ve kullandığınız
          ürün ve özelliklere bağlıdır. Topladığımız kişisel bilgiler şunları
          içerebilir:
        </Typography>
        <Typography variant="body1" paragraph>
          <ul>
            <li>
              <strong>Ad ve İletişim Bilgileri:</strong> Adınız, soyadınız,
              e-posta adresiniz, posta adresiniz, telefon numaranız ve benzeri
              iletişim bilgilerini toplarız.
            </li>
            <li>
              <strong>Kimlik Bilgileri:</strong> Kimlik doğrulama ve hesap
              erişimi için kullanılan şifreler, şifre ipuçları ve benzeri
              güvenlik bilgilerini toplarız.
            </li>
            <li>
              <strong>Ödeme Bilgileri:</strong> Satın alma işlemi
              gerçekleştirmeniz durumunda, ödeme aracınızın numarası (örneğin,
              kredi kartı numarası) ve ödeme aracınıza ilişkin güvenlik kodu
              gibi bilgileri toplarız.
            </li>
            <li>
              <strong>Sağlık Bilgileri:</strong> Sağlık durumunuz ve geçmişiniz,
              diş kayıtlarınız, tedavi planlarınız ve ilgili bilgiler gibi
              sağlık bilgilerini toplarız.
            </li>
          </ul>
        </Typography>
        <Typography variant="h4" gutterBottom>
          Bilgilerinizi Nasıl Kullanırız
        </Typography>
        <Typography variant="body1" paragraph>
          Topladığımız bilgileri şu amaçlarla kullanırız:
        </Typography>
        <Typography variant="body1" paragraph>
          <ul>
            <li>
              Hesap oluşturma ve oturum açma işlemlerini kolaylaştırmak için
            </li>
            <li>Size pazarlama ve promosyon iletişimleri göndermek için</li>
            <li>Size idari bilgiler göndermek için</li>
            <li>Siparişlerinizi yerine getirmek ve yönetmek için</li>
            <li>Referanslarınızı yayınlamak için</li>
            <li>Geri bildirim talep etmek için</li>
            <li>Hizmetlerimizi korumak için</li>
            <li>
              Şartlarımızı, koşullarımızı ve politikalarımızı uygulamak için
            </li>
            <li>Yasal taleplere yanıt vermek ve zararları önlemek için</li>
            <li>
              Diğer ticari amaçlar için, örneğin veri analizi, kullanım
              trendlerini belirleme, promosyon kampanyalarımızın etkinliğini
              belirleme ve hizmetlerimizi, ürünlerimizi, pazarlamamızı ve
              deneyiminizi değerlendirme ve iyileştirme
            </li>
          </ul>
        </Typography>
        <Typography variant="h4" gutterBottom>
          Bilgilerinizi Paylaşma
        </Typography>
        <Typography variant="body1" paragraph>
          Bilgilerinizi yalnızca sizin izninizle, yasalara uymak için, size
          hizmet sunmak için, haklarınızı korumak için veya ticari
          yükümlülüklerimizi yerine getirmek için paylaşırız. Spesifik olarak,
          aşağıdaki durumlarda bilgilerinizi işleme veya paylaşma ihtiyacımız
          olabilir:
        </Typography>
        <Typography variant="body1" paragraph>
          <ul>
            <li>
              <strong>İş Transferleri:</strong> Şirket varlıklarının tamamının
              veya bir kısmının satışı, finansmanı veya devri sırasında veya
              müzakereleri sırasında bilgilerinizin paylaşılması veya devri
            </li>
            <li>
              <strong>
                Tedarikçiler, Danışmanlar ve Diğer Üçüncü Taraf Hizmet
                Sağlayıcılar:
              </strong>{" "}
              Bilgilerinizi bizim adımıza hizmet sunan veya bizim adımıza
              çalışmak için erişim gerektiren üçüncü taraf satıcılar, hizmet
              sağlayıcılar, müteahhitler veya ajanlarla paylaşabiliriz
            </li>
            <li>
              <strong>Yasal Yükümlülükler:</strong> Yasalara uymak, hükümet
              taleplerine yanıt vermek, yargı süreci, mahkeme emri veya yasal
              süreç gibi durumlarda bilgilerinizi paylaşabiliriz
            </li>
          </ul>
        </Typography>
        <Typography variant="h4" gutterBottom>
          Bilgilerinizin Güvenliği
        </Typography>
        <Typography variant="body1" paragraph>
          Kişisel bilgilerinizi korumak için idari, teknik ve fiziksel güvenlik
          önlemleri kullanıyoruz. Sağladığınız kişisel bilgileri güvence altına
          almak için makul adımlar atmış olsak da, hiçbir güvenlik önleminin
          mükemmel veya aşılmaz olmadığını ve hiçbir veri iletim yönteminin her
          türlü müdahale veya kötüye kullanım karşısında garanti edilemeyeceğini
          lütfen unutmayın.
        </Typography>
        <Typography variant="h4" gutterBottom>
          Gizlilik Haklarınız
        </Typography>
        <Typography variant="body1" paragraph>
          Bulunduğunuz yere bağlı olarak, kişisel bilgilerinizle ilgili belirli
          haklara sahip olabilirsiniz. Bu haklar şunları içerebilir:
        </Typography>
        <Typography variant="body1" paragraph>
          <ul>
            <li>Kişisel verilerinize erişim sağlama ve bir kopyasını edinme</li>
            <li>Kişisel verilerinizdeki yanlışlıkları düzeltme</li>
            <li>Kişisel verilerinizi silme</li>
            <li>
              Kişisel verilerinizin işlenmesini kısıtlama veya itiraz etme
            </li>
            <li>Veri taşınabilirliğ.</li>
          </ul>
        </Typography>
        <Typography variant="body1" paragraph>
          Bu hakları kullanmak için{" "}
          <a href="mailto:dishekime@gmail.com">dishekime@gmail.com</a> üzerinden
          bizimle iletişime geçin. Herhangi bir talebi ilgili veri koruma
          yasalarına uygun olarak değerlendirecek ve harekete geçireceğiz.
        </Typography>
        <Typography variant="h4" gutterBottom>
          Bu Gizlilik Politikasındaki Değişiklikler
        </Typography>
        <Typography variant="body1" paragraph>
          Bu gizlilik politikasını, uygulamalarımız, teknolojilerimiz, yasal
          gereksinimlerimiz ve diğer faktörleri yansıtmak için zaman zaman
          güncelleyebiliriz. Yeni gizlilik politikasını web sitemizde
          yayınlayarak herhangi bir önemli değişikliği size bildireceğiz. Bu
          gizlilik politikasını periyodik olarak gözden geçirmeniz tavsiye
          edilir.
        </Typography>
        <Typography variant="h4" gutterBottom>
          Bizimle İletişime Geçin
        </Typography>
        <Typography variant="body1" paragraph>
          Bu politika hakkında sorularınız veya yorumlarınız varsa, bizimle şu
          adresten iletişime geçebilirsiniz:{" "}
          <a href="mailto:dishekime@gmail.com">dishekime@gmail.com</a>
        </Typography>
      </Grid>
    </Grid>
  );
}

export default PrivacyPolicy;
