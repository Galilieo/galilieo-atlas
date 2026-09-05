export interface PersonalTimelineEntry {
  id: string;
  dateTime: string;
  period: string;
  phase: string;
  title: string;
  description: string;
  href: string;
  destination: string;
}

export const personalTimeline: PersonalTimelineEntry[] = [
  {
    id: 'ai-product-internship',
    dateTime: '2026-06',
    period: '2026.06 — 至今',
    phase: '03 / Practice',
    title: 'AI 产品开发实习',
    description:
      '参与 AI 产品的前端和移动端开发，处理页面返回、任务等待和跨页面数据更新，也在手机上排查问题。',
    href: '/projects/ai-chat-app/',
    destination: '查看实习项目',
  },
  {
    id: 'heart-island',
    dateTime: '2026-04',
    period: '2026.04 — 至今',
    phase: '02 / Building',
    title: '持续开发「心屿」',
    description:
      '做一个可以记录情绪、获得 AI 回复和匿名交流的地方。接下来想继续做多轮对话和长期记忆。',
    href: '/projects/heart-island/',
    destination: '查看心屿项目',
  },
  {
    id: 'software-engineering',
    dateTime: '2024-09',
    period: '2024.09 — 至今',
    phase: '01 / Learning',
    title: '软件工程学习',
    description: '开始学习软件工程，从写页面和接口做起，再通过项目理解它们怎样一起工作。',
    href: '/campus/',
    destination: '查看在校经历',
  },
];
