'use client';

import { 
  SparklesIcon, 
  DocumentTextIcon, 
  GlobeAltIcon, 
  CpuChipIcon,
  ClockIcon,
  AcademicCapIcon,
  ChartBarIcon,
  CloudArrowUpIcon,
  DevicePhoneMobileIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

/**
 * 功能特性页面组件
 * 展示Ankigenix的核心功能和优势
 */
export default function Features() {
  /**
   * 核心功能列表
   */
  const coreFeatures = [
    {
      icon: SparklesIcon,
      title: 'AI智能生成',
      description: '利用AI技术自动分析学习材料，快速生成结构化的Anki闪卡',
      details: [
        '智能提取文本中的关键知识点',
        '自动生成问答格式的闪卡内容',
        '支持批量处理大量学习材料',
        '生成符合Anki标准格式的卡片'
      ]
    },
    {
      icon: DocumentTextIcon,
      title: '多种输入方式',
      description: '灵活的内容输入方式，适应不同的学习材料来源',
      details: [
        '直接粘贴文本内容生成',
        '上传PDF、Word等文档文件',
        '输入网页URL自动抓取内容',
        '输入主题关键词智能扩展'
      ]
    },
    {
      icon: CloudArrowUpIcon,
      title: '一键导出',
      description: '生成的闪卡可直接导出为Anki格式，无缝衔接学习流程',
      details: [
        '导出标准.apkg格式文件',
        '支持自定义卡组名称',
        '可选择导出部分或全部卡片',
        '兼容Anki桌面版和移动版'
      ]
    },
    {
      icon: ClockIcon,
      title: '高效便捷',
      description: '大幅减少手动制卡时间，让学习更专注于记忆和理解',
      details: [
        '几分钟完成数十张闪卡制作',
        '实时预览生成的卡片内容',
        '支持在线编辑和调整',
        '简洁直观的操作界面'
      ]
    }
  ];

  /**
   * 高级功能列表
   */
  const advancedFeatures = [
    {
      icon: DocumentTextIcon,
      title: '智能内容提取',
      description: '从各类文档中准确提取学习内容'
    },
    {
      icon: AcademicCapIcon,
      title: '多学科适用',
      description: '适用于语言、历史、科学等各类学科'
    },
    {
      icon: ChartBarIcon,
      title: '任务管理',
      description: '查看历史生成记录，管理学习材料'
    },
    {
      icon: ShieldCheckIcon,
      title: '数据安全',
      description: '用户数据加密存储，保护隐私安全'
    },
    {
      icon: DevicePhoneMobileIcon,
      title: '响应式设计',
      description: '完美适配桌面和移动设备浏览器'
    },
    {
      icon: ArrowPathIcon,
      title: '批量编辑',
      description: '支持批量删除、恢复闪卡操作'
    }
  ];

  /**
   * 使用场景列表
   */
  const useCases = [
    {
      title: '考试备考',
      description: '快速将教材、讲义转换为闪卡，系统化复习',
      example: '上传课程PDF，自动生成知识点问答卡片'
    },
    {
      title: '语言学习',
      description: '制作单词、短语卡片，加速词汇积累',
      example: '粘贴英文文章，提取生词并生成双语卡片'
    },
    {
      title: '职业认证',
      description: '整理专业考试资料，提高记忆效率',
      example: '将培训文档转换为重点知识闪卡'
    },
    {
      title: '知识管理',
      description: '构建个人知识库，长期积累学习成果',
      example: '从阅读材料中提取关键概念，建立知识体系'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero区域 */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              AI驱动的闪卡生成工具
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-600">
              AnkiGenix利用AI技术，帮助您快速将学习材料转换为高质量的Anki闪卡，大幅提升学习效率
            </p>
          </div>
        </div>
      </div>

      {/* 核心功能详细介绍 */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">核心功能</h2>
            <p className="mt-4 text-lg text-gray-600">
              四大核心功能，全面提升您的学习效率
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {coreFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                  <div className="flex items-center mb-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-6">{feature.description}</p>
                  
                  <ul className="space-y-3">
                    {feature.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start">
                        <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <span className="ml-3 text-gray-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 高级功能网格 */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">更多特性</h2>
            <p className="mt-4 text-lg text-gray-600">
              丰富的功能特性，提升学习体验
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {advancedFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 使用场景 */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">使用场景</h2>
            <p className="mt-4 text-lg text-gray-600">
              适用于各种学习场景，满足不同用户需求
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{useCase.title}</h3>
                <p className="text-gray-600 mb-4">{useCase.description}</p>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">示例：</span>{useCase.example}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 技术优势 */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-8">为什么选择AnkiGenix</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">简单易用</div>
                <div className="text-blue-100">三步完成闪卡生成</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">高效准确</div>
                <div className="text-blue-100">AI智能提取知识点</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">完全兼容</div>
                <div className="text-blue-100">支持Anki标准格式</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA区域 */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            开始使用AnkiGenix
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            立即体验AI驱动的闪卡生成，让学习更高效
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/register" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              免费注册
            </a>
            <a href="/dashboard" className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              进入控制台
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}