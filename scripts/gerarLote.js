const gerarPost = require('./gerarPost'); // ajuste o caminho se necessário

const assuntos = [
  "buracos negros", "inteligência artificial", "evolução humana", "física quântica", "neurociência",
  "teoria das cordas", "energia escura", "matéria escura", "DNA", "RNA", "vacinas", "imunologia",
  "cérebro", "memória", "sono", "sonhos", "gravidade", "relatividade", "tempo", "espaço",
  "universo", "galáxias", "estrelas", "planetas", "exoplanetas", "vida extraterrestre",
  "astrobiologia", "biotecnologia", "engenharia genética", "clonagem", "células-tronco",
  "fotossíntese", "ecossistemas", "biodiversidade", "extinção", "mudanças climáticas",
  "aquecimento global", "camada de ozônio", "oceano", "correntes marítimas", "vulcões",
  "terremotos", "placas tectônicas", "meteorologia", "raios", "tornados", "furacões",
  "energia solar", "energia eólica", "energia nuclear", "fusão nuclear", "fissão nuclear",
  "partículas subatômicas", "aceleradores de partículas", "bóson de Higgs", "antimatéria",
  "computação quântica", "robótica", "nanotecnologia", "materiais inteligentes", "óptica",
  "laser", "termodinâmica", "entropia", "eletricidade", "magnetismo", "eletromagnetismo",
  "ondas gravitacionais", "tecnologia espacial", "foguetes", "satélites", "GPS", "ISS",
  "missões espaciais", "Marte", "Lua", "Júpiter", "Saturno", "Urano", "Netuno", "Plutão",
  "cometas", "asteroides", "meteoritos", "big bang", "cosmologia", "tempo profundo",
  "arqueologia", "antropologia", "linguística", "psicologia", "sociologia", "economia comportamental",
  "matemática", "álgebra", "geometria", "cálculo", "estatística", "probabilidade", "teoria dos jogos",
  "criptografia", "segurança digital", "internet", "redes neurais", "machine learning",
  "deep learning", "visão computacional", "biometria", "engenharia elétrica", "engenharia civil",
  "engenharia mecânica", "engenharia aeroespacial", "engenharia ambiental", "engenharia de materiais"
];

(async () => {
  for (const assunto of assuntos) {
    console.log(`🔄 Gerando post sobre: ${assunto}`);
    try {
      await gerarPost(assunto);
    } catch (err) {
      console.error(`❌ Erro ao gerar post sobre "${assunto}":`, err.message);
    }
  }
  console.log("✅ Todos os posts foram gerados e salvos.");
})();
