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
      description: '基于先进的AI技术，自动分析学习内容，生成高质量的Anki闪卡',
      details: [
        '智能内容分析和关键点提取',
        '自动生成问答对和填空题',
        '支持多种题型和难度调节',
        '持续学习优化生成质量'
      ]
    },
    {
      icon: DocumentTextIcon,
      title: '多种输入方式',
      description: '支持文本、文件、网页链接等多种输入方式，满足不同学习场景',
      details: [
        '直接文本输入和编辑',
        'PDF、Word、PPT文件上传',
        '网页链接内容抓取',
        '主题关键词智能扩展'
      ]
    },
    {
      icon: GlobeAltIcon,
      title: '多语言支持',
      description: '支持中文、英文等多种语言，满足全球用户的学习需求',
      details: [
        '中英文内容智能识别',
        '多语言闪卡生成',
        '语言学习专用模式',
        '本地化界面支持'
      ]
    },
    {
      icon: CpuChipIcon,
      title: '智能难度调节',
      description: '根据学习目标和水平，自动调整闪卡难度和复杂度',
      details: [
        '初级、中级、高级难度选择',
        '自适应难度调整算法',
        '个性化学习路径规划',
        '学习进度智能跟踪'
      ]
    }
  ];

  /**
   * 高级功能列表
   */
  const advancedFeatures = [
    {
      icon: ClockIcon,
      title: '批量处理',
      description: '支持大量内容的批量处理，提高学习效率'
    },
    {
      icon: AcademicCapIcon,
      title: '学科专业化',
      description: '针对不同学科优化，提供专业的学习支持'
    },
    {
      icon: ChartBarIcon,
      title: '学习分析',
      description: '详细的学习数据分析和进度跟踪'
    },
    {
      icon: CloudArrowUpIcon,
      title: '云端同步',
      description: '多设备云端同步，随时随地学习'
    },
    {
      icon: DevicePhoneMobileIcon,
      title: '移动优化',
      description: '完美适配移动设备，支持离线学习'
    },
    {
      icon: ShieldCheckIcon,
      title: '数据安全',
      description: '企业级数据加密和隐私保护'
    },
    {
      icon: UserGroupIcon,
      title: '团队协作',
      description: '支持团队共享和协作学习'
    },
    {
      icon: ArrowPathIcon,
      title: '持续更新',
      description: '定期功能更新和AI模型优化'
    }
  ];

  /**
   * 使用场景列表
   */
  const useCases = [
    {
      title: '学生考试复习',
      description: '快速制作考试复习卡片，提高记忆效率',
      example: '将教材内容转换为闪卡，系统化复习知识点'
    },
    {
      title: '语言学习',
      description: '制作词汇和语法卡片，加速语言掌握',
      example: '从文章中提取生词，自动生成双语卡片'
    },
    {
      title: '职业技能培训',
      description: '制作专业知识卡片，提升职业能力',
      example: '将培训资料转换为实用的技能卡片'
    },
    {
      title: '学术研究',
      description: '整理研究资料，构建知识体系',
      example: '从论文中提取关键概念，建立知识网络'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero区域 */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              强大的AI功能
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-600">
              Ankigenix集成了最先进的AI技术，为您提供智能、高效、个性化的学习卡片生成体验
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
            <h2 className="text-3xl font-bold text-gray-900">高级功能</h2>
            <p className="mt-4 text-lg text-gray-600">
              更多强大功能，满足您的各种学习需求
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
            <h2 className="text-3xl font-bold text-white mb-8">技术优势</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">99.9%</div>
                <div className="text-blue-100">内容识别准确率</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">&lt;3s</div>
                <div className="text-blue-100">平均生成时间</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">50+</div>
                <div className="text-blue-100">支持语言数量</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA区域 */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            准备好体验AI驱动的学习了吗？
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            立即开始使用Ankigenix，让AI为您的学习加速
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              免费开始使用
            </button>
            <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              查看演示
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}