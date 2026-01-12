import { Layout, makeScene2D, Rect, Txt, Circle } from "@motion-canvas/2d";
import { CodeBlock, insert, word, remove, lines } from '@motion-canvas/2d/lib/components/CodeBlock';
import { all, createRef, DEFAULT, easeInOutSine, Vector2, waitFor } from "@motion-canvas/core";

export default makeScene2D(function* (view) {
  // 1. Elementlerdi jaratıw ushın Ref'lar
  const codeRef = createRef<CodeBlock>();
  const highlighter = createRef<Rect>(); // "Júriwshi" ramka
  const hintText = createRef<Txt>();     // Kod bólimleri atı (Init, Cond...)
  const boolTag = createRef<Txt>();      // TRUE / FALSE jazıwı
  const iValueRef = createRef<Txt>();
  const consoleRef = createRef<Layout>();

  // Temadaǵı kod teksti
  const code = `for (let i = 0; i < 3; i++) {
  console.log(i);
}`;

  // 2. Scene sızıw
  view.add(
    <Layout layout direction={'column'} gap={60} alignItems={'center'}>
      {/* 1. Kod hám onıń ústindegi elementler */}
      <Layout>
        <CodeBlock
          ref={codeRef}
          code={code}
          fontSize={50}
          fontFamily={'JetBrains Mono, monospace'} // #Font
        />

        {/* Júriwshi Ramka (Highlighter) - Absolyut jaylasadı */}
        <Rect
          ref={highlighter}
          lineWidth={4}
          stroke={'#ebcb8b'}
          radius={8}
          opacity={0}
          zIndex={2}
        />

        {/* TRUE/FALSE kórsetkishi */}
        <Txt
          ref={boolTag}
          fontSize={30}
          fontFamily={'Arial'}
          fontWeight={700}
          opacity={0}
          y={-50} // Kodtıń tóbesine shıǵadı
          zIndex={3}
        />
      </Layout>

      {/* 2. Ózgeriwshi hám Comments panel */}
      <Layout gap={100} alignItems={'start'}>
        <Layout direction={'column'} gap={20}>
          <Txt fill={'#666'} fontSize={30}>Memory:</Txt>
          <Rect fill={'#2e3440'} padding={40} radius={16} stroke={'#4c566a'} lineWidth={2}>
            <Txt fill={'#eceff4'} fontSize={40}>
              i = <Txt ref={iValueRef} text={'-'} fill={'#a3be8c'} />
            </Txt>
          </Rect>
        </Layout>

        <Layout direction={'column'} gap={20}>
          <Txt fill={'#666'} fontSize={30}>Comment:</Txt>
          {/* Bul jerde kodtıń qaysı bólegi islep atırǵanı jazıladı */}
          <Txt ref={hintText} fill={'#88c0d0'} fontSize={40} text={''} />
        </Layout>
      </Layout>

      {/* 3. Console */}
      <Rect 
        fill={'#000'}
        width={600}
        height={200}
        radius={12}
        padding={20}
        direction={'column'}
        clip
        layout
      >
        <Txt fill={'#555'} fontSize={24} marginBottom={10}>Console Output:</Txt>
        <Layout ref={consoleRef} direction={'column'} gap={5} />
      </Rect>

    </Layout>
  );

  yield* waitFor(0.1);

  // Ramkanı kerekli jerge kóshiriw funktsiyası
  function* moveHighlight(selection: any, duration: number = 0.5) {
    // CodeBlocktıń selection funckiyası bizge koordinataların beredi
    const bbox: any = codeRef().selection(selection);

    if (bbox && bbox.length > 0 && bbox[0]) {
      // Ramkanı sol jerge alıp baramız hám ólshemin maslaymız
      yield* all(
        highlighter().opacity(1, 0.2),
        highlighter().position(bbox[0].position, duration, easeInOutSine),
        highlighter().size(bbox[0].size.add([20, 10]), duration, easeInOutSine), // biraz úlkenlew
      );
    }
  }

  // True/False kórsetiw funkciyası
  function* showBoolean(val: boolean, position: Vector2) {
    boolTag().text(val ? 'TRUE' : 'FALSE');
    boolTag().fill(val ? '#a3be8c' : '#bf616a'); // Jasıl yáki qızıl
    boolTag().position(position.add([0, -60])); // Kodtıń tóbesinde

    yield* boolTag().opacity(1, 0.3);
    yield* boolTag().scale(1.2, 0.3);
    yield* all(
      boolTag().opacity(0, 0.3),
      boolTag().scale(1, 0.3)
    );
  }

  // --- ANIMACIYA BASLANÍWÍ ---
  // 1-BASQISH: Anatomiya (Structure)
  yield* hintText().text('For cikli dúziliwi...', 1);

  // Initialization
  yield* moveHighlight(word(0, 5, 9));
  yield* hintText().text('1. Baslanǵish noqat (Init)', 0.5);
  yield* waitFor(1);

  // Condition
  yield* moveHighlight(word(0, 16, 5));
  yield* hintText().text('2. Shárt (Condition)', 0.5);
  yield* waitFor(1);

  // Update
  yield* moveHighlight(word(0, 23, 3));
  yield* hintText().text('3. Ózgeriw (Update)', 0.5);
  yield* waitFor(1);

  // 2-BASQISH: Cikldiń islewi (Execution)

  // 1. Init: let i = 0
  yield* moveHighlight(word(0, 5, 9));
  yield* iValueRef().text('0', 0.5);
  yield* waitFor(0.5);

  for (let i = 0; i < 3; i++) {
    // 2. Condition: i < 3
    yield* moveHighlight(word(0, 16, 5));

    // True jazıwın shıǵarıw (Ramkanıń házirgi ornına qarap)
    yield* showBoolean(true, highlighter().position());
    
    // 3. Body: console.log(i)
    yield* moveHighlight(lines(1));

    // Consoleǵa jazıw
    consoleRef().add(<Txt fill={'#fff'} fontSize={30}>{`> ${i}`}</Txt>);
    yield* waitFor(0.5);

    // 4. Update: i++
    yield* moveHighlight(word(0, 23, 3));
    const nextVal = (i + 1).toString();
    yield* iValueRef().text(nextVal, 0.5); // Memory jańalaw
    yield* waitFor(0.5);
  }

  // 3-BASQISH: JUWMAQLAW
  // Aqırǵı tekseriw: i < 3 (i=3 bolǵanda)
  yield* moveHighlight(word(0, 16, 5));
  yield* showBoolean(false, highlighter().position()); // FALSE

  yield* highlighter().stroke('#bf616a', 0.5); //Ramka qızarıp qátelik beredi
  yield* hintText().text('Shárt orınlanbadı. Cikl juwmaqlandı.', 0.5);
  yield* waitFor(2);
});