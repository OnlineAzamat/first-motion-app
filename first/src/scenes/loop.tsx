import { Layout, makeScene2D, Rect, Txt, Circle } from "@motion-canvas/2d";
import { CodeBlock, insert, word, remove, lines } from '@motion-canvas/2d/lib/components/CodeBlock';
import { createRef, DEFAULT, waitFor } from "@motion-canvas/core";

export default makeScene2D(function* (view) {
  // 1. Elementlerdi jaratıw ushın Ref'lar
  const codeRef = createRef<CodeBlock>();
  const iValueRef = createRef<Txt>();
  const consoleRef = createRef<Layout>();

  // Temadaǵı kod teksti
  const code = `for (let i = 0; i < 3; i++) {
  console.log("Sálem: " + i);  
}`;

  // 2. Scene sızıw
  view.add(
    <Layout layout direction={'row'} gap={100} alignItems={'center'}>
      {/* Shep tárep: Kod blokı */}
      <CodeBlock 
        ref={codeRef}
        fontSize={50}
        fontFamily={'JetBrains Mono, monospace'} // #Font
        code={code}
      />

      {/* Oń tárep: Vizualizaciya */}
      <Layout layout direction={'column'} gap={50}>

        {/* Ózgeriwshi qutısı */}
        <Rect 
          fill={'#242424ff'}
          stroke={'#666'}
          lineWidth={2}
          radius={20}
          padding={40}
          layout
          alignItems={'center'}
          gap={20}
        >
          <Txt fill={'#aaa'} fontSize={30}>Variable i:</Txt>
          <Txt ref={iValueRef} fill={'#4caf50'} fontSize={50} fontWeight={700}>-</Txt>
        </Rect>

        {/* Console qutısı */}
        <Rect
          ref={consoleRef}
          fill={'#1e1e1e'}
          width={400}
          height={300}
          radius={20}
          clip
          direction={'column'}
          padding={20}
          gap={10}
          layout // Layout rejimin jaǵıw
        >
          <Txt fill={'#666'} fontSize={24} marginBottom={10}>Terminal / Console</Txt>
          {/* Loglar usı jerge túsedi */}
        </Rect>
        
      </Layout>
    </Layout>
  );

  // 3. Animaciya baslanıwı

  // Basında hesh nárse tańlanbaǵan
  yield* codeRef().selection(DEFAULT, 0);
  yield* waitFor(1);

  // STEP 1. Initialization (let i = 0)
  // Kodta `let i = 0` bólimin belgileymiz (1-qatar)
  yield* codeRef().selection(word(0, 5, 9), 1);
  yield* iValueRef().text('0', 0.5); // Ózgeriwshide 0 payda boladı
  yield* waitFor(1);

  // Endi cikldi aylandıramız (3 márte)
  for (let i = 0; i < 3; i++) {

    // STEP 2: Shártti tekseriw (i < 3)
    yield* codeRef().selection(word(0, 16, 5), 0.5);
    yield* waitFor(0.5);
    // Bul jerde vizual effekt beriw múmkin (máselen true degen jazıw),
    // bıraq házirshe ápiwayı ótip ketemiz.

    // STEP 3: 'Body' bólimin orınlaw (console.log)
    yield* codeRef().selection(lines(1), 0.5);

    // Console'ǵa jazıw shıǵarıw animaciyası
    const logText = createRef<Txt>();
    consoleRef().add(
      <Txt ref={logText} fill={'white'} fontSize={28} opacity={0}>
        {`> Sálem: ${i}`}
      </Txt>
    );
    yield* logText().opacity(1, 0.5);
    yield* waitFor(1);

    // STEP 4: Increment (i++)
    yield* codeRef().selection(word(0, 23, 3), 0.5);

    // i mánisin (value) ózgertiriw
    const nextVal = (i + 1).toString();
    yield* iValueRef().text(nextVal, 0.5);
    yield* waitFor(0.5);
  }

  // STEP 5: Cikl juwmaqlanıwı
  // Shárt jáne tekseriledi (i < 3), endi i=3 bolǵanı ushın false
  yield* codeRef().selection(word(0, 16, 5), 0.5);

  // Kodtan shıǵıw (óshirib qoyıw)
  yield* codeRef().selection(DEFAULT, 1);
  yield* iValueRef().fill('#ff5252', 0.5); // Qızıl reńge kirip toqtaǵanın bildiredi

  yield* waitFor(2);
});