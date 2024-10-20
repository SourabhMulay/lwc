import { createElement } from 'lwc';
import { extractDataIds, USE_LIGHT_DOM_SLOT_FORWARDING } from 'test-utils';

import LightContainer from './x/lightContainer/lightContainer';

describe('light DOM slot forwarding reactivity', () => {
    let nodes;
    let lightContainer;

    beforeAll(() => {
        lightContainer = createElement('x-light-container', { is: LightContainer });
        document.body.appendChild(lightContainer);
        nodes = extractDataIds(lightContainer);
    });

    afterAll(() => {
        document.body.removeChild(lightContainer);
    });

    const verifySlotContent = (leaf, expected) => {
        const children = Array.from(leaf.shadowRoot?.children ?? leaf.children);
        let expectedIndex = 0;
        children.forEach((child) => {
            const actualSlotContent =
                child.tagName.toLowerCase() === 'slot' ? child.assignedNodes() : [child];

            actualSlotContent.forEach((slotContent) => {
                expect(child.getAttribute('slot')).toEqual(expected[expectedIndex].slotAssignment);
                expect(slotContent.innerText).toEqual(expected[expectedIndex++].slotContent);
            });
        });
    };

    const expectedDefaultSlotContent = (shadowMode) => [
        {
            slotAssignment: 'upper',
            slotContent: 'Upper slot content',
        },
        {
            slotAssignment: 'lower',
            slotContent: 'Lower slot content',
        },
        {
            slotAssignment:
                shadowMode.includes('shadow') || USE_LIGHT_DOM_SLOT_FORWARDING ? '' : null,
            slotContent: 'Default slot content',
        },
    ];

    const expectedSlotContentAfterParentMutation = (shadowMode) => [
        {
            slotAssignment: 'upper',
            slotContent: 'Lower slot content',
        },
        {
            slotAssignment: 'lower',
            slotContent: 'Upper slot content',
        },
        {
            slotAssignment:
                shadowMode.includes('shadow') || USE_LIGHT_DOM_SLOT_FORWARDING ? '' : null,
            slotContent: 'Default slot content',
        },
    ];

    const expectedSlotContentAfterForwardedSlotMutation = [
        {
            slotAssignment: 'upper',
            slotContent: 'Upper slot content',
        },
        {
            slotAssignment: 'lower',
            slotContent: 'Default slot content',
        },
        {
            slotAssignment: '',
            slotContent: 'Lower slot content',
        },
    ];

    const expectedSlotContentAfterLeafMutation = (shadowMode) => [
        {
            slotAssignment: 'lower',
            slotContent:
                shadowMode.includes('shadow') && !USE_LIGHT_DOM_SLOT_FORWARDING
                    ? 'Lower slot content'
                    : 'Upper slot content',
        },
        {
            slotAssignment: '',
            slotContent:
                shadowMode.includes('shadow') && !USE_LIGHT_DOM_SLOT_FORWARDING
                    ? 'Upper slot content'
                    : 'Default slot content',
        },
        {
            slotAssignment: 'upper',
            slotContent:
                shadowMode.includes('shadow') && !USE_LIGHT_DOM_SLOT_FORWARDING
                    ? 'Default slot content'
                    : 'Lower slot content',
        },
    ];

    const expectedSlotContentAfterConditionalMutation = [
        {
            slotAssignment: 'lower',
            slotContent: 'Upper slot content',
        },
        {
            slotAssignment: '',
            slotContent: 'Default slot content',
        },
        {
            slotAssignment: 'upper',
            slotContent: 'Lower slot content',
        },
        {
            slotAssignment: 'upper',
            slotContent: 'Conditional slot content',
        },
    ];

    const testCases = [
        {
            testName: 'lightLight',
            expectedDefaultSlotContent: expectedDefaultSlotContent('light'),
            expectedSlotContentAfterParentMutation: expectedSlotContentAfterParentMutation('light'),
            expectedSlotContentAfterForwardedSlotMutation: USE_LIGHT_DOM_SLOT_FORWARDING
                ? expectedSlotContentAfterForwardedSlotMutation
                : expectedSlotContentAfterParentMutation('light'),
            expectedSlotContentAfterLeafMutation: USE_LIGHT_DOM_SLOT_FORWARDING
                ? expectedSlotContentAfterLeafMutation('light')
                : expectedSlotContentAfterParentMutation('light'),
            expectedSlotContentAfterConditionalMutation: USE_LIGHT_DOM_SLOT_FORWARDING
                ? expectedSlotContentAfterConditionalMutation
                : [
                      {
                          slotAssignment: 'upper',
                          slotContent: 'Lower slot content',
                      },
                      {
                          slotAssignment: 'upper',
                          slotContent: 'Conditional slot content',
                      },
                      {
                          slotAssignment: 'lower',
                          slotContent: 'Upper slot content',
                      },
                      {
                          slotAssignment: null,
                          slotContent: 'Default slot content',
                      },
                  ],
        },
        {
            testName: 'lightShadow',
            expectedDefaultSlotContent: expectedDefaultSlotContent('shadow'),
            expectedSlotContentAfterParentMutation:
                expectedSlotContentAfterParentMutation('shadow'),
            expectedSlotContentAfterForwardedSlotMutation: USE_LIGHT_DOM_SLOT_FORWARDING
                ? expectedSlotContentAfterForwardedSlotMutation
                : expectedSlotContentAfterParentMutation('shadow'),
            expectedSlotContentAfterLeafMutation: expectedSlotContentAfterLeafMutation('shadow'),
            expectedSlotContentAfterConditionalMutation: USE_LIGHT_DOM_SLOT_FORWARDING
                ? expectedSlotContentAfterConditionalMutation
                : [
                      {
                          slotAssignment: 'lower',
                          slotContent: 'Lower slot content',
                      },
                      {
                          slotAssignment: 'lower',
                          slotContent: 'Conditional slot content',
                      },
                      {
                          slotAssignment: '',
                          slotContent: 'Upper slot content',
                      },
                      {
                          slotAssignment: 'upper',
                          slotContent: 'Default slot content',
                      },
                  ],
        },
        {
            test: it.runIf(process.env.NATIVE_SHADOW),
            testName: 'shadowLight',
            expectedDefaultSlotContent: expectedDefaultSlotContent('shadow'),
            expectedSlotContentAfterParentMutation:
                expectedSlotContentAfterParentMutation('shadow'),
            expectedSlotContentAfterForwardedSlotMutation,
            expectedSlotContentAfterLeafMutation: USE_LIGHT_DOM_SLOT_FORWARDING
                ? expectedSlotContentAfterLeafMutation('shadow')
                : expectedSlotContentAfterForwardedSlotMutation,
            expectedSlotContentAfterConditionalMutation: USE_LIGHT_DOM_SLOT_FORWARDING
                ? expectedSlotContentAfterConditionalMutation
                : [
                      {
                          slotAssignment: 'upper',
                          slotContent: 'Upper slot content',
                      },
                      {
                          slotAssignment: 'lower',
                          slotContent: 'Default slot content',
                      },
                      {
                          slotAssignment: '',
                          slotContent: 'Lower slot content',
                      },
                      {
                          slotAssignment: '',
                          slotContent: 'Conditional slot content',
                      },
                  ],
        },
    ];

    testCases.forEach(
        ({
            testName,
            expectedDefaultSlotContent,
            expectedSlotContentAfterParentMutation,
            expectedSlotContentAfterForwardedSlotMutation,
            expectedSlotContentAfterLeafMutation,
            expectedSlotContentAfterConditionalMutation,
            test = it,
        }) => {
            test(`should update correctly for ${testName} slots`, async () => {
                const parent = nodes[testName];
                const leaf = parent.leaf;
                expect((leaf.shadowRoot?.children ?? leaf.children).length).toBe(3);

                verifySlotContent(leaf, expectedDefaultSlotContent);

                lightContainer[`${testName}Upper`] = 'lower';
                lightContainer[`${testName}Lower`] = 'upper';

                await Promise.resolve();

                verifySlotContent(leaf, expectedSlotContentAfterParentMutation);

                parent.upperSlot = '';
                parent.lowerSlot = 'upper';
                parent.defaultSlot = 'lower';

                await Promise.resolve();

                verifySlotContent(leaf, expectedSlotContentAfterForwardedSlotMutation);

                leaf.upperSlot = 'lower';
                leaf.lowerSlot = '';
                leaf.defaultSlot = 'upper';

                await Promise.resolve();

                verifySlotContent(leaf, expectedSlotContentAfterLeafMutation);

                lightContainer[`${testName}ConditionalSlot`] = true;

                await Promise.resolve();

                verifySlotContent(leaf, expectedSlotContentAfterConditionalMutation);
            });
        }
    );
});
