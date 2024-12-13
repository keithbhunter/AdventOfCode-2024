export class TreeNode<T> {
  children: TreeNode<T>[] = [];

  constructor(
    readonly value: T,
    readonly parent?: TreeNode<T>,
  ) {}

  addChild(value: T): TreeNode<T> {
    const child = new TreeNode(value, this);
    this.children.push(child);
    return child;
  }
}

export default class Tree<T> {
  root: TreeNode<T>;

  constructor(root: T) {
    this.root = new TreeNode(root);
  }

  *preOrderTraversal(node = this.root): Generator<TreeNode<T>> {
    yield node;
    if (node.children.length > 0) {
      for (const child of node.children) {
        yield* this.preOrderTraversal(child);
      }
    }
  }

  // [Symbol.for("nodejs.util.inspect.custom")]() {

  // }
}
