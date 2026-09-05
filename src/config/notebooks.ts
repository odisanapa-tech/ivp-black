/**
 * Тетради для демонстрации кабинета педагога (раздел 9 ТЗ).
 *
 * Вопросы взяты из уже написанных страниц продуктов: инвентаризация опыта,
 * достижения, что умею и не считаю способностью, с кем работаю и с кем нет.
 * Настоящие тетради заказчик передаст позже.
 *
 * Ключевое в модели: видимость живет на уровне ОТДЕЛЬНОГО ПОЛЯ, а не тетради.
 * В тетрадях человек пишет про провалы, про деньги и про страх назвать цену -
 * наружу это не выносится никогда.
 */

export type FieldVisibility = 'private' | 'public';

export type NotebookField = {
  id: string;
  question: string;
  hint?: string;
  /** Что подставляется в публичный профиль, если поле открыто. */
  profileLabel?: string;
  /**
   * Поля, которые нельзя открыть наружу ни при каких настройках:
   * деньги, провалы, страхи. Переключателя у них нет вовсе.
   */
  neverPublic?: boolean;
};

export type NotebookSection = {
  id: string;
  title: string;
  fields: NotebookField[];
};

export type Notebook = {
  id: string;
  title: string;
  subtitle: string;
  /** Демонстрируется полностью только одна тетрадь. */
  available: boolean;
  sections: NotebookSection[];
};

export const NOTEBOOKS: Notebook[] = [
  {
    id: 'inventarizaciya',
    title: 'Тетрадь 1. Инвентаризация',
    subtitle: 'Что у вас за плечами и что вы умеете, но способностью не считаете',
    available: true,
    sections: [
      {
        id: 'bagazh',
        title: 'Багаж',
        fields: [
          {
            id: 'obrazovanie',
            question: 'Образование и места работы',
            hint: 'Без дат и регалий списком. Достаточно того, что вы сами считаете важным.',
            profileLabel: 'Образование и опыт',
          },
          {
            id: 'formaty',
            question: 'В каких форматах вы работаете сейчас',
            hint: 'Дети индивидуально, группа, взрослые, онлайн, подготовка к конкурсу.',
            profileLabel: 'Форматы работы',
          },
          {
            id: 'gorod',
            question: 'Город',
            profileLabel: 'Город',
          },
        ],
      },
      {
        id: 'dostizheniya',
        title: 'Достижения и находки',
        fields: [
          {
            id: 'gordost',
            question: 'Случай, которым вы гордитесь',
            hint: 'Не обязательно про конкурс. Иногда это про то, что человек снова запел.',
            profileLabel: 'Случай из практики',
          },
          {
            id: 'ne-otpuskaet',
            question: 'Случай, который до сих пор не отпускает',
            hint: 'Это поле остается только у вас. Наружу оно не выносится никогда.',
            neverPublic: true,
          },
          {
            id: 'ne-schitayu-sposobnostyu',
            question: 'Что вы умеете, но способностью не считаете',
            hint: 'Обычно именно здесь лежит метод. Свое собственное кажется само собой разумеющимся.',
            profileLabel: 'Как я работаю',
          },
        ],
      },
      {
        id: 'granicy',
        title: 'Границы',
        fields: [
          {
            id: 's-kem-rabotayu',
            question: 'С кем вы работаете',
            hint: 'Возраст, запрос, тип ученика.',
            profileLabel: 'С кем работает',
          },
          {
            id: 's-kem-ne-rabotayu',
            question: 'С кем вы не работаете и почему',
            hint: 'Внутренняя заметка для себя, помогает не брать чужое.',
            neverPublic: true,
          },
          {
            id: 'dengi',
            question: 'Сколько вы берете и что происходит внутри, когда цену надо назвать',
            hint: 'Про деньги и про страх назвать цену. Это поле не выносится наружу никогда.',
            neverPublic: true,
          },
        ],
      },
    ],
  },
  {
    id: 'metod',
    title: 'Тетрадь 2. Метод и продукты',
    subtitle: 'Из собранного вынимается то, как именно вы работаете',
    available: false,
    sections: [],
  },
  {
    id: 'golos',
    title: 'Тетрадь 3. Голос снаружи',
    subtitle: 'О чем вы говорите миру и какими словами',
    available: false,
    sections: [],
  },
];

/** Все поля первой тетради подряд: нужно для прогресса и сборки профиля. */
export function allFields(notebook: Notebook): NotebookField[] {
  return notebook.sections.flatMap((s) => s.fields);
}
