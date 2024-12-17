class Node<T> {
  values: (T | Node<T>)[];

  constructor(values: T[]) {
    this.values = values;
  }

  get length(): number {
    return this.values.reduce(
      (acc, valueOrNode) =>
        acc + (valueOrNode instanceof Node ? valueOrNode.length : 1),
      0,
    );
  }
}

export default class ArrayTree<T> {
  private root: Node<T>;

  constructor(values: T[]) {
    this.root = new Node(values);
  }

  get length(): number {
    return this.root.length;
  }

  private _at(index: number): [T, Node<T>, number] | undefined {
    const findNode = (
      node: Node<T>,
      index: number,
      start: number,
    ): [T, Node<T>, number] | undefined => {
      // console.log("find", index, node.values, start);
      let localIndex = 0;
      let overallIndex = start;

      while (localIndex < node.values.length) {
        const valueOrNode = node.values[localIndex];
        const isNode = valueOrNode instanceof Node;

        if (!isNode) {
          if (overallIndex === index) {
            return [valueOrNode, node, localIndex];
          }
          localIndex++;
          overallIndex++;
          continue;
        }

        const nodeLength = valueOrNode.length;
        if (index >= overallIndex && index < overallIndex + nodeLength) {
          return findNode(valueOrNode as Node<T>, index, overallIndex);
        } else {
          localIndex++;
          overallIndex += nodeLength;
        }
      }
    };
    return findNode(this.root, index, 0);
  }

  at(index: number): T | undefined {
    return this._at(index)?.[0];
  }

  replace(index: number, values: T | T[]) {
    // console.log("replace", index, values);
    const result = this._at(index);
    if (!result) {
      throw new Error(`${index} out of bounds`);
    }
    const [, node, localIndex] = result;
    node.values[localIndex] = Array.isArray(values) ? new Node(values) : values;
  }

  *preOrderTraversal(node = this.root): Generator<T> {
    for (const valueOrNode of node.values) {
      if (valueOrNode instanceof Node) {
        yield* this.preOrderTraversal(valueOrNode);
      } else {
        yield valueOrNode;
      }
    }
  }
}
