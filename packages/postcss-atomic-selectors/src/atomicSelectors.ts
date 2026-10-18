import type { PluginCreator, Root, Rule, ChildNode, AtRule } from 'postcss';
import postcss from 'postcss';

const postcssAtomicSelectors: PluginCreator<never> = () => {
  return {
    postcssPlugin: 'postcss-atomic-selectors',
    OnceExit(root: Root) {
      const newNodes: ChildNode[] = [];

      root.walkRules((rule: Rule) => {
        const selectors = rule.selectors;

        selectors.forEach((selector) => {
          const singleRule = postcss.rule({
            selector: selector.trim(),
            source: rule.source,
          });

          rule.each((child) => {
            if (child.type === 'decl') {
              singleRule.append(child.clone());
            }
          });

          if (singleRule.nodes.length === 0) {
            return;
          }

          let currentWrapper: ChildNode = singleRule;
          let parent = rule.parent;

          while (parent && parent.type !== 'root') {
            if (parent.type === 'atrule') {
              const atRuleParent = parent as AtRule;

              if (
                atRuleParent.name === 'layer' &&
                (!atRuleParent.nodes || atRuleParent.nodes.length === 0)
              ) {
                parent = parent.parent;
                continue;
              }

              const newAtRule = postcss.atRule({
                name: atRuleParent.name,
                params: atRuleParent.params,
                source: rule.source,
              });

              newAtRule.append(currentWrapper);
              currentWrapper = newAtRule;
            }

            parent = parent.parent;
          }

          newNodes.push(currentWrapper);
        });
      });

      root.walkAtRules((atRule: AtRule) => {
        if (
          atRule.parent?.type === 'root' &&
          (!atRule.nodes || atRule.nodes.length === 0)
        ) {
          newNodes.push(atRule.clone());
        }
      });

      root.removeAll();
      root.append(newNodes);
    },
  };
};

postcssAtomicSelectors.postcss = true;

export default postcssAtomicSelectors;
