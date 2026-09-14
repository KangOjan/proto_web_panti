const LucideIcon = ({
  name,
  className = '',
  size = 24,
  strokeWidth = 2,
  title = null,
  ...props
}) => {
  const toPascalCase = (value) =>
    String(value || '')
      .split(/[-_\s]+/)
      .filter(Boolean)
      .map(
        (part) =>
          part.charAt(0).toUpperCase() +
          part.slice(1)
      )
      .join('');

  const normalizeAttributes = (attributes = {}) =>
    Object.fromEntries(
      Object.entries(attributes).map(([key, value]) => {
        if (key === 'class') {
          return ['className', value];
        }

        if (
          key.startsWith('aria-') ||
          key.startsWith('data-')
        ) {
          return [key, value];
        }

        return [
          key.replace(
            /-([a-z])/g,
            (_, letter) => letter.toUpperCase()
          ),
          value,
        ];
      })
    );

  const renderNode = (node, key) => {
    if (!Array.isArray(node)) {
      return null;
    }

    const [tag, attributes = {}, children = []] = node;

    return React.createElement(
      tag,
      {
        ...normalizeAttributes(attributes),
        key,
      },
      Array.isArray(children)
        ? children.map((child, index) =>
            renderNode(child, `${key}-${index}`)
          )
        : undefined
    );
  };

  const iconKey = toPascalCase(name);
  const iconDefinition =
    window.lucide?.icons?.[iconKey];

  if (!iconDefinition) {
    if (window.SIMK_CONFIG?.DEBUG === true) {
      console.warn(`Lucide icon "${name}" not found.`);
    }

    return null;
  }

  const iconNodes =
    Array.isArray(iconDefinition) &&
    iconDefinition[0] === 'svg'
      ? iconDefinition[2] || []
      : iconDefinition;

  const accessibleProps = title
    ? {
        role: 'img',
        'aria-label': title,
      }
    : {
        'aria-hidden': 'true',
      };

  return React.createElement(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      width: size,
      height: size,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      focusable: 'false',
      className,
      ...accessibleProps,
      ...props,
    },
    ...(title
      ? [React.createElement('title', { key: 'title' }, title)]
      : []),
    ...iconNodes.map((node, index) =>
      renderNode(node, `${name}-${index}`)
    )
  );
};

window.LucideIcon = LucideIcon;
