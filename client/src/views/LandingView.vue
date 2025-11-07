<template>
  <div class="landing-container">
    <h1>Üdvözöljük az Alvásnaplóban</h1>
    <p class="tagline">Kövesse nyomon alvási szokásait, javítsa életminőségét, és ébredjen frissebben minden reggel.</p>

    <div class="features-grid">

      <div class="feature-box">
        <i class="icon">📈</i>
        <h3>Könnyed Felhasználás</h3>
        <p>Lásd a trendeket! Kövesd nyomon alvásod minőségét, mélységét egyszerűen, érthetően.</p>
      </div>

      <div class="feature-box">
        <i class="icon">📊</i>
        <h3>Hasznos Diagramok</h3>
        <p>Elemezz! Hozzáférhetsz hasznos diagramokhoz, hogy jobban megértsd a pihenési mintáidat.</p>
      </div>

      <div class="feature-box">
        <i class="icon">🎯</i>
        <h3>Célok Kitűzése</h3>
        <p>Rendszerezz! Tűzz ki személyes alvási célokat, és kövesd, mennyire sikerül tartani a kitűzött ritmust.</p>
      </div>

    </div>

    <div class="cta-section">
      <p>Kezdje el ma, és fedezze fel a jobb alvás titkát!</p>
      <router-link to="/register" class="cta-button">Kezdés</router-link>
      <router-link to="/login" class="cta-link">Már van fiókom</router-link>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.landing-container {
    text-align: center;
    padding: 60px 20px;
    max-width: 1100px;
    margin: 0 auto;
}
h1 {
    font-size: 3em;
    color: #334d6e;
    margin-bottom: 10px;
}
.tagline {
    font-size: 1.2em;
    color: #555;
    margin-bottom: 40px;
}

.features-grid {
    display: flex;
    justify-content: space-between;
    gap: 30px;
    margin-bottom: 50px;
}

.feature-box {
    flex: 1;
    padding: 30px;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
    text-align: center;
    border-top: 5px solid #007bff;
    transition: transform 0.5s;
}

.feature-box:hover {
    transform: translateY(-10px);
}

.icon {
    font-size: 3em;
    display: block;
    margin-bottom: 15px;
    color: #007bff;
}

.feature-box h3 {
    color: #334d6e;
    margin-top: 0;
    margin-bottom: 15px;
    font-size: 1.5em;
}

.feature-box p {
    color: #666;
    line-height: 1.6;
}

.cta-section {
    margin-top: 40px;
    padding: 30px;
    background-color: #e6f0ff;
    border-radius: 10px;
    border: 1px solid #c4d2e5;
}
.cta-button {
    display: inline-block;
    padding: 15px 30px;
    background-color: #007bff;
    color: white;
    text-decoration: none;
    font-size: 1.2em;
    font-weight: bold;
    border-radius: 8px;
    margin: 10px;
    transition: background-color 0.3s;
}
.cta-button:hover {
    background-color: #0056b3;
}
.cta-link {
    display: inline-block;
    color: #007bff;
    font-weight: bold;
    text-decoration: none;
    margin: 10px;
    padding: 10px 15px;
    border-radius: 0.5rem;
}

.cta-link:hover {
    color: #0056b3;
    background-color: #99bddb;
}

@media (max-width: 900px) {
    .features-grid {
        flex-wrap: wrap;
        justify-content: center;
    }

    .feature-box {
        flex: 1 1 calc(50% - 30px);
        margin-bottom: 20px;
    }
}

@media (max-width: 600px) {
    .feature-box {
        flex: 1 1 100%;
    }

    h1 {
        font-size: 2em;
    }

    .cta-button {
        display: block;
        width: 100%;
        box-sizing: border-box;
    }
}
</style>
