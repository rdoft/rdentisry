import React from "react";
import { Grid, Typography } from "@mui/material";

// assets
import { ReactComponent as Logo } from "assets/svg/dishekime/dishekime.svg";

function Terms() {
  return (
    <Grid container justifyContent="center" style={{ padding: "2rem" }}>
      <Grid item xs={12} md={8}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          {" "}
          <Logo style={{ width: "200px" }} />
        </div>{" "}
        <Typography variant="h3" gutterBottom>
          Kullanım Hükümleri
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Güncelleme Tarihi: 26 Temmuz 2024</strong>
        </Typography>
        <Typography variant="body1" paragraph>
          Bu Kullanım Hükümleri ("Hükümler") disheki.me web sitesinin
          kullanımını düzenler. Web sitemizi kullanarak bu hükümlere bağlı
          kalmayı kabul etmektesiniz. Eğer bu hükümlere uymayı kabul
          etmiyorsanız, lütfen web sitemizi kullanmaktan vazgeçiniz.
        </Typography>
        <Typography variant="h4" gutterBottom>
          Kullanım Koşulları
        </Typography>
        <Typography variant="h5" gutterBottom>
          Hizmetin Kullanımı
        </Typography>
        <Typography variant="body1" paragraph>
          Web sitemizi yalnızca yasal amaçlarla ve bu hükümlere uygun olarak
          kullanmayı kabul edersiniz. Aşağıdaki durumlarda web sitemizi
          kullanamazsınız:
        </Typography>
        <Typography variant="body1" paragraph>
          <ul>
            <li>
              Herhangi bir geçerli yasa veya yönetmeliği ihlal edecek şekilde
            </li>
            <li>Dolandırıcılık amaçlı veya yasa dışı faaliyetlerde bulunmak</li>
            <li>Web sitesinin düzgün çalışmasını engellemek için</li>
            <li>Başkalarının fikri mülkiyet haklarını ihlal edecek şekilde</li>
          </ul>
        </Typography>
        <Typography variant="h5" gutterBottom>
          Fikri Mülkiyet Hakları
        </Typography>
        <Typography variant="body1" paragraph>
          Web sitemizde yer alan tüm içerik, logolar, grafikler, metinler ve
          diğer materyaller disheki.me veya lisans verenlerine aittir ve telif
          hakkı yasaları ile korunmaktadır. Bu içerikleri izinsiz kullanmanız
          yasaktır.
        </Typography>
        <Typography variant="h5" gutterBottom>
          Kullanıcı Hesapları
        </Typography>
        <Typography variant="body1" paragraph>
          Web sitemize kaydolurken doğru ve eksiksiz bilgi sağlamayı kabul
          edersiniz. Hesabınızın güvenliğini sağlamak sizin sorumluluğunuzdadır.
          Hesabınızın izinsiz kullanımı durumunda derhal bize bildirimde
          bulunmalısınız.
        </Typography>
        <Typography variant="h5" gutterBottom>
          Üçüncü Taraf Bağlantıları
        </Typography>
        <Typography variant="body1" paragraph>
          Web sitemiz, üçüncü taraf web sitelerine bağlantılar içerebilir. Bu
          bağlantılar yalnızca sizin kolaylığınız için sağlanmıştır ve bu
          sitelerin içeriğinden sorumlu değiliz.
        </Typography>
        <Typography variant="h5" gutterBottom>
          Garanti Reddi
        </Typography>
        <Typography variant="body1" paragraph>
          Web sitemiz "olduğu gibi" ve "mevcut olduğu şekilde" sağlanmaktadır.
          Web sitemizin hata içermediği veya kesintisiz olacağı konusunda
          herhangi bir garanti vermiyoruz. Web sitemizi kullanmanız tamamen
          sizin sorumluluğunuzdadır.
        </Typography>
        <Typography variant="h5" gutterBottom>
          Sorumluluğun Sınırlandırılması
        </Typography>
        <Typography variant="body1" paragraph>
          Hiçbir durumda disheki.me, web sitemizin kullanımından kaynaklanan
          doğrudan, dolaylı, tesadüfi, özel veya cezai zararlardan sorumlu
          tutulamaz.
        </Typography>
        <Typography variant="h5" gutterBottom>
          Değişiklikler
        </Typography>
        <Typography variant="body1" paragraph>
          Bu hüküm ve koşulları herhangi bir zamanda güncelleme veya değiştirme
          hakkımız saklıdır. Değişiklikler bu sayfada yayınlanacaktır ve
          değişikliklerin yayınlanmasından sonra web sitemizi kullanmaya devam
          etmeniz, bu değişiklikleri kabul ettiğiniz anlamına gelir.
        </Typography>
        <Typography variant="h5" gutterBottom>
          İletişim
        </Typography>
        <Typography variant="body1" paragraph>
          Bu Kullanım Hükümleri hakkında sorularınız varsa, bizimle şu adresten
          iletişime geçebilirsiniz:{" "}
          <a href="mailto:dishekime@gmail.com">dishekime@gmail.com</a>
        </Typography>
      </Grid>
    </Grid>
  );
}

export default Terms;
